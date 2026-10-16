import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppState,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';

import { BackButton } from '@/components/BackButton';
import { CourseFolderCard } from '@/components/CourseFolderCard';
import { FloatingActionPill, type DockTab } from '@/components/FloatingActionPill';
import { PermissionBanner } from '@/components/PermissionBanner';
import { TaskCard, type TaskCardVariant } from '@/components/TaskCard';
import { COURSES, type Course } from '@/constants/courses';
import { NO_BG_ICONS } from '@/constants/iconAssets';
import { DesignTokens } from '@/constants/theme';
import {
  checkNotificationPermissions,
  getNotificationPermissionDetails,
} from '@/services/notifications';
import {
  getTasks,
  hasSeenNotificationPrompt,
  setUserNotificationConsent,
} from '@/services/storage';
import { setTaskDone } from '@/services/taskService';
import type { Task } from '@/types/task';
import { groupTasks } from '@/utils/groupTasks';

const { colors, spacing, radius, typography, shadows, controls } = DesignTokens;

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function HomeScreen() {
  const router = useRouter();

  // Tab aktif: 'today' (layar 1), 'matkul' (layar 2 - Saved), 'tugas' (layar 3 - Chats)
  const [activeTab, setActiveTab] = useState<DockTab>('today');

  // Filter mata kuliah jika salah satu folder diketuk pada tab 'matkul'
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<Course | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const load = useCallback(async () => {
    setTasks(await getTasks());
    setLoaded(true);
  }, []);

  // Periksa apakah ini pemakaian pertama kali. Jika ya, arahkan ke S4.
  useEffect(() => {
    let isMounted = true;
    async function checkFirstLaunch() {
      const seen = await hasSeenNotificationPrompt();
      if (!seen) {
        router.replace('/notification-permission');
        return;
      }
      const granted = await checkNotificationPermissions();
      if (isMounted) {
        setHasPermission(granted);
      }
    }
    checkFirstLaunch();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Dengarkan perubahan status aplikasi (mis. saat kembali dari Pengaturan HP)
  useEffect(() => {
    let lastOsStatus: string | null = null;
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active') {
        const details = await getNotificationPermissionDetails();
        if (details.osStatus === 'granted' && lastOsStatus === 'denied') {
          await setUserNotificationConsent(true);
        }
        lastOsStatus = details.osStatus;
        const granted = await checkNotificationPermissions();
        setHasPermission(granted);
      } else if (nextState === 'background') {
        const details = await getNotificationPermissionDetails();
        lastOsStatus = details.osStatus;
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  // Muat ulang data tugas dan periksa izin setiap layar kembali fokus
  useFocusEffect(
    useCallback(() => {
      load();
      checkNotificationPermissions().then((granted) => {
        setHasPermission(granted);
      });
    }, [load])
  );

  const groups = useMemo(() => groupTasks(tasks), [tasks]);

  const handleToggle = useCallback(
    async (task: Task) => {
      try {
        await setTaskDone(task, !task.isDone);
      } catch {
        // Gagal memperbarui; daftar dimuat ulang agar tampilan sesuai data tersimpan
      }
      await load();
    },
    [load]
  );

  const openDetail = useCallback(
    (task: Task) => router.push({ pathname: '/task/[id]', params: { id: task.id } }),
    [router]
  );

  const openForm = useCallback(
    (prefillCourse?: string) => {
      if (prefillCourse) {
        router.push({ pathname: '/task/form', params: { course: prefillCourse } });
      } else {
        router.push('/task/form');
      }
    },
    [router]
  );

  // Hitung jumlah tugas aktif per mata kuliah 1KA03
  const taskCountsByCourse = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tasks) {
      if (t.isDone || !t.course) continue;
      const cleanCourse = t.course.trim().toLowerCase();
      const matched = COURSES.find(
        (c) =>
          c.fullName.toLowerCase() === cleanCourse ||
          c.shortName.toLowerCase() === cleanCourse ||
          c.id === cleanCourse
      );
      if (matched) {
        counts[matched.id] = (counts[matched.id] || 0) + 1;
      }
    }
    return counts;
  }, [tasks]);

  // Tanggal terformat gaya reference ("Okt '26 Rabu")
  const todayFormatted = useMemo(() => {
    const now = new Date();
    const m = BULAN[now.getMonth()];
    const y = String(now.getFullYear()).slice(-2);
    const dayName = HARI[now.getDay()];
    return `${m} '${y} ${dayName}`;
  }, []);

  // Tugas mendesak (terlambat & hari ini) untuk narasi sapaan Hero
  const urgentOrTodayTasks = useMemo(() => {
    return [...groups.overdue, ...groups.today];
  }, [groups]);

  const urgentOrTodayCount = urgentOrTodayTasks.length;
  const highlightTitles = urgentOrTodayTasks.slice(0, 3).map((t) => t.title);

  // Kumpulan ikon 3D acak dari assets/images/icons-no-bg/ untuk sapaan Hero (Ghanim, kuliah, dan setiap tugas)
  // Dipilih secara murni dan deterministik (React 19 pure) berdasarkan seed tanggal dan judul tugas
  const heroIcons = useMemo(() => {
    let dateHash = 0;
    for (let i = 0; i < todayFormatted.length; i++) {
      dateHash = (dateHash << 5) - dateHash + todayFormatted.charCodeAt(i);
      dateHash |= 0;
    }
    const ghanimIdx = Math.abs(dateHash) % NO_BG_ICONS.length;
    const kuliahIdx = (ghanimIdx + 3) % NO_BG_ICONS.length;

    return {
      ghanim: NO_BG_ICONS[ghanimIdx],
      kuliah: NO_BG_ICONS[kuliahIdx],
      getTaskIcon: (title: string, idx: number) => {
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
          hash = (hash << 5) - hash + title.charCodeAt(i);
          hash |= 0;
        }
        const taskIdx = (Math.abs(hash) + idx + 1) % NO_BG_ICONS.length;
        return NO_BG_ICONS[taskIdx === ghanimIdx ? (taskIdx + 1) % NO_BG_ICONS.length : taskIdx];
      },
    };
  }, [todayFormatted]);

  // Seed acak per-mount untuk ikon 3D empty state agar dinamis & playful sesuai aturan design.md
  const [randomIconSeed] = useState(() => Math.floor(Math.random() * NO_BG_ICONS.length));

  // Ikon 3D acak dari assets/images/icons-no-bg/ untuk empty state:
  // 1. emptyCourseIcon: dipilih secara unik & acak berdasarkan matkul yang dipilih + randomIconSeed
  // 2. emptyTodayIcon: ikon playful untuk keadaan tugas kosong di tab Today
  // 3. emptyUrgentIcon: ikon santai untuk keadaan saat tidak ada tugas mendesak
  // 4. emptyChatsIcon: ikon bubble chat playful untuk keadaan tugas kosong di tab Chats
  const emptyCourseIcon = useMemo(() => {
    if (!selectedCourseFilter) {
      return NO_BG_ICONS[randomIconSeed % NO_BG_ICONS.length];
    }
    const cIdx = COURSES.findIndex((c) => c.id === selectedCourseFilter.id);
    if (cIdx >= 0) {
      return NO_BG_ICONS[(cIdx * 7 + randomIconSeed) % NO_BG_ICONS.length];
    }
    let hash = 0;
    const key = selectedCourseFilter.id;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return NO_BG_ICONS[(Math.abs(hash) + randomIconSeed) % NO_BG_ICONS.length];
  }, [selectedCourseFilter, randomIconSeed]);

  const emptyTodayIcon = useMemo(
    () => NO_BG_ICONS[randomIconSeed % NO_BG_ICONS.length],
    [randomIconSeed]
  );
  const emptyUrgentIcon = useMemo(
    () => NO_BG_ICONS[(randomIconSeed + 4) % NO_BG_ICONS.length],
    [randomIconSeed]
  );
  const emptyChatsIcon = useMemo(
    () => NO_BG_ICONS[(randomIconSeed + 8) % NO_BG_ICONS.length],
    [randomIconSeed]
  );

  const activeSections: { key: string; label: string; variant: TaskCardVariant; items: Task[] }[] = [
    { key: 'overdue', label: 'Terlambat', variant: 'urgent', items: groups.overdue },
    { key: 'today', label: 'Hari ini', variant: 'today', items: groups.today },
    { key: 'thisWeek', label: 'Minggu ini', variant: 'week', items: groups.thisWeek },
    { key: 'later', label: 'Nanti', variant: 'later', items: groups.later },
  ];

  // Perhitungan khusus untuk tab Today/Homepage:
  // 1. Terlambat: ditaruh paling atas
  // 2. Highlights: tugas hari ini, besok, dan lusa (tanpa pemisahan header waktu)
  const { todayOverdueTasks, todayHighlights, endOfTodayTime } = useMemo(() => {
    const now = new Date();
    const nowMs = now.getTime();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    // Batas akhir hari ini dan batas akhir lusa (H+2) hingga 23:59:59.999
    const endOfToday = new Date(year, month, date, 23, 59, 59, 999).getTime();
    const endOfLusa = new Date(year, month, date + 2, 23, 59, 59, 999).getTime();

    const sortByDueAt = (a: Task, b: Task) => a.dueAt - b.dueAt;

    // Tugas terlambat yang belum selesai
    const overdue = tasks
      .filter((t) => !t.isDone && t.dueAt < nowMs)
      .sort(sortByDueAt);

    // Tugas highlights: belum selesai, deadline antara sekarang s.d. lusa 23:59:59
    const highlights = tasks
      .filter((t) => !t.isDone && t.dueAt >= nowMs && t.dueAt <= endOfLusa)
      .sort(sortByDueAt);

    return {
      todayOverdueTasks: overdue,
      todayHighlights: highlights,
      endOfTodayTime: endOfToday,
    };
  }, [tasks]);

  const todayHighlightsCount = todayOverdueTasks.length + todayHighlights.length;

  const isEmpty = loaded && tasks.length === 0;
  const doneCount = groups.completed.length;
  const activeTasksCount = tasks.filter((t) => !t.isDone).length;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* ============================================================== */}
      {/* 1. MODE TAMPILAN UTAMA ("Today" - Mengacu Layar Kiri reference.jpg) */}
      {/* ============================================================== */}
      {activeTab === 'today' && (
        <ScrollView
          style={styles.screenScroll}
          contentContainerStyle={styles.todayScrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Bagian Atas Berlatar Gelap Pekat (#161513) */}
          <View style={styles.heroDarkTop}>
            {/* Header: Kiri logo + "plss.inget", Kanan aksen titik oranye + tanggal */}
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroBrandWrap}>
                <Image
                  source={require('../../assets/logo-icon.png')}
                  style={styles.heroBrandLogo}
                  resizeMode="contain"
                />
                <Text style={styles.heroBrandText}>plss.inget</Text>
              </View>
              <View style={styles.heroDateRow}>
                <View style={styles.orangeDot} />
                <Text style={styles.heroDateText}>{todayFormatted}</Text>
              </View>
            </View>

            {/* Sapaan Tipografi Besar Bergaya Narasi */}
            <View style={styles.heroSummaryBody}>
              <Text style={styles.narrativeText}>
                <Text style={styles.textMutedDark}>Halo, Ghanim</Text>
                <Image
                  source={heroIcons.ghanim}
                  style={styles.heroInlineIcon}
                  resizeMode="contain"
                />
                <Text style={styles.textMutedDark}>! Hari ini ada </Text>
                <Text style={styles.textBrightWhite}>
                  {urgentOrTodayCount > 0 ? `${urgentOrTodayCount} tugas kuliah` : 'tugas kuliah'}
                </Text>
                <Image
                  source={heroIcons.kuliah}
                  style={styles.heroInlineIcon}
                  resizeMode="contain"
                />
                <Text style={styles.textMutedDark}> yang perlu diselesaikan</Text>
                {highlightTitles.length > 0 ? (
                  <>
                    <Text style={styles.textMutedDark}>: </Text>
                    {highlightTitles.map((itemTitle, idx) => (
                      <React.Fragment key={idx}>
                        <Text style={styles.textBrightWhite}>{itemTitle}</Text>
                        <Image
                          source={heroIcons.getTaskIcon(itemTitle, idx)}
                          style={styles.heroInlineIcon}
                          resizeMode="contain"
                        />
                        {idx < highlightTitles.length - 1 ? (
                          <Text style={styles.textMutedDark}>, </Text>
                        ) : (
                          <Text style={styles.textMutedDark}>.</Text>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <Text style={styles.textBrightWhite}>: semua tuntas rapi.</Text>
                )}
              </Text>

              {/* Baris Ringkas Berdasarkan N Mata Kuliah Aktif */}
              <Text style={styles.heroMetaLine}>
                Berdasarkan {COURSES.length} mata kuliah aktif kelas 1KA03
              </Text>
            </View>
          </View>

          {/* Kontainer Bawah: Lembar Permukaan Terang (#f8f5f0) dengan Sudut Membulat Besar 32px */}
          <View style={styles.todaySheetContainer}>
            {/* Banner Izin Notifikasi jika belum aktif */}
            {hasPermission === false && !bannerDismissed && (
              <PermissionBanner onDismiss={() => setBannerDismissed(true)} />
            )}

            {/* Subheader Lembar: Dari Tugas / Chats */}
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetHeaderTitle}>Daftar Tugas</Text>
              <Text style={styles.sheetHeaderCount}>{todayHighlightsCount} tugas</Text>
            </View>

            {isEmpty ? (
              <View style={styles.emptyCard}>
                <Image
                  source={emptyTodayIcon}
                  style={styles.emptyCardIcon3D}
                  resizeMode="contain"
                />
                <Text style={styles.emptyTitle}>Belum ada tugas</Text>
                <Text style={styles.emptySubtitle}>
                  Belum ada tugas tercatat. Santai sejenak, atau ketuk tombol di bawah untuk mencatat tugas baru dari dosen!
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Tambah tugas baru"
                  onPress={() => openForm()}
                  style={({ pressed }) => [styles.emptyBigButton, pressed && styles.btnPressed]}>
                  <Text style={styles.emptyBigButtonText}>+ Tambah Tugas Baru</Text>
                </Pressable>
              </View>
            ) : todayHighlightsCount === 0 ? (
              <View style={styles.emptyCard}>
                <Image
                  source={emptyUrgentIcon}
                  style={styles.emptyCardIcon3D}
                  resizeMode="contain"
                />
                <Text style={styles.emptyTitle}>Tidak ada tugas mendesak</Text>
                <Text style={styles.emptySubtitle}>
                  {activeTasksCount > 0
                    ? `Semua tugas terdekat (hari ini, besok, lusa) sudah rapi! Kamu memiliki ${activeTasksCount} tugas di tab Semua Tugas.`
                    : 'Semua tugas telah tuntas rapi. Santai sejenak, atau catat tugas baru!'}
                </Text>
                {activeTasksCount > 0 ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Lihat semua tugas"
                    onPress={() => setActiveTab('tugas')}
                    style={({ pressed }) => [styles.emptyBigButton, pressed && styles.btnPressed]}>
                    <Text style={styles.emptyBigButtonText}>Lihat Semua Tugas →</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tambah tugas baru"
                    onPress={() => openForm()}
                    style={({ pressed }) => [styles.emptyBigButton, pressed && styles.btnPressed]}>
                    <Text style={styles.emptyBigButtonText}>+ Tambah Tugas Baru</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <>
                {/* 1. TERLAMBAT (Tetap seperti itu dan diletakkan paling atas) */}
                {todayOverdueTasks.length > 0 && (
                  <View style={styles.groupSection}>
                    <Text style={[styles.groupHeaderLabel, styles.urgentHeaderLabel]}>
                      Terlambat ({todayOverdueTasks.length})
                    </Text>
                    {todayOverdueTasks.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        variant="urgent"
                        onToggleDone={handleToggle}
                        onPress={openDetail}
                      />
                    ))}
                  </View>
                )}

                {/* 2. HIGHLIGHTS (Hari Ini, Besok, Lusa) - Tanpa pengelompokan waktu */}
                {todayHighlights.length > 0 && (
                  <View style={styles.highlightListSection}>
                    {todayHighlights.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        variant={t.dueAt <= endOfTodayTime ? 'today' : 'week'}
                        onToggleDone={handleToggle}
                        onPress={openDetail}
                      />
                    ))}
                  </View>
                )}

                {/* Akordeon Kelompok Selesai (N) jika ada tugas selesai */}
                {doneCount > 0 && (
                  <View style={styles.groupSection}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ expanded: doneOpen }}
                      onPress={() => setDoneOpen((v) => !v)}
                      style={styles.accordionHeader}>
                      <Text style={styles.accordionTitle}>
                        {doneOpen ? '▾' : '▸'} Selesai ({doneCount})
                      </Text>
                    </Pressable>
                    {doneOpen &&
                      groups.completed.map((t) => (
                        <TaskCard
                          key={t.id}
                          task={t}
                          variant="done"
                          onToggleDone={handleToggle}
                          onPress={openDetail}
                        />
                      ))}
                  </View>
                )}
              </>
            )}

          </View>
        </ScrollView>
      )}

      {/* ============================================================== */}
      {/* 2. MODE TAMPILAN "Matkul" (Saved - Mengacu Layar Tengah reference.jpg) */}
      {/* ============================================================== */}
      {activeTab === 'matkul' && (
        <ScrollView
          style={styles.screenScroll}
          contentContainerStyle={styles.matkulScrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Jika sedang menyaring tugas mata kuliah tertentu */}
          {selectedCourseFilter ? (
            <View style={styles.courseFilterView}>
              {/* Tombol Kembali ke Semua Folder */}
              <BackButton
                label="Semua Matkul"
                accessibilityLabel="Kembali ke semua folder matkul"
                onPress={() => setSelectedCourseFilter(null)}
              />

              {/* Banner Detail Mata Kuliah */}
              <View
                style={[
                  styles.courseHeroBanner,
                  { backgroundColor: DesignTokens.colors.vibrant[selectedCourseFilter.colorKey]?.bg || colors.surface },
                ]}>
                <Text
                  style={[
                    styles.courseHeroTitle,
                    { color: DesignTokens.colors.vibrant[selectedCourseFilter.colorKey]?.text || colors.text },
                  ]}>
                  {selectedCourseFilter.fullName}
                </Text>
              </View>

              {/* Daftar Tugas Khusus Mata Kuliah Ini */}
              <View style={styles.courseTaskListWrap}>
                <View style={styles.courseTaskHeaderRow}>
                  <Text style={styles.courseTaskHeaderTitle}>Tugas {selectedCourseFilter.shortName}</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openForm(selectedCourseFilter.fullName)}
                    style={styles.smallAddPill}>
                    <Text style={styles.smallAddPillText}>+ Tugas Baru</Text>
                  </Pressable>
                </View>

                {(() => {
                  const filtered = tasks.filter((t) => {
                    if (!t.course) return false;
                    const cLower = t.course.toLowerCase();
                    return (
                      cLower === selectedCourseFilter.fullName.toLowerCase() ||
                      cLower === selectedCourseFilter.shortName.toLowerCase() ||
                      cLower === selectedCourseFilter.id.toLowerCase()
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <View style={styles.emptyCourseBox}>
                        <Image
                          source={emptyCourseIcon}
                          style={styles.emptyCourseIcon3D}
                          resizeMode="contain"
                        />
                        <Text style={styles.emptyCourseTitle}>Belum ada tugas nihhh</Text>
                        <Text style={styles.emptyCourseSubtitle}>
                          Alhamdulillah ga ada tugas {selectedCourseFilter.shortName}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Tambah tugas baru untuk ${selectedCourseFilter.shortName}`}
                          onPress={() => openForm(selectedCourseFilter.fullName)}
                          style={({ pressed }) => [styles.emptyBigButton, pressed && styles.btnPressed]}>
                          <Text style={styles.emptyBigButtonText}>+ Tambah Tugas Baru</Text>
                        </Pressable>
                      </View>
                    );
                  }

                  return filtered.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      variant={t.isDone ? 'done' : 'today'}
                      colorKey={selectedCourseFilter.colorKey}
                      onToggleDone={handleToggle}
                      onPress={openDetail}
                    />
                  ));
                })()}
              </View>
            </View>
          ) : (
            <>
              {/* Header Layar Matkul: "Matkul", "8 matkul", dan tombol '+' */}
              <View style={styles.matkulHeaderRow}>
                <Text style={styles.matkulLargeTitle}>Matkul</Text>
                <View style={styles.matkulHeaderRight}>
                  <Text style={styles.matkulCountLabel}>{COURSES.length} matkul</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tambah tugas baru"
                    onPress={() => openForm()}
                    style={({ pressed }) => [styles.matkulPlusBtn, pressed && styles.btnPressed]}>
                    <Text style={styles.matkulPlusText}>+</Text>
                  </Pressable>
                </View>
              </View>

              {/* Grid 2 Kolom Berisi 8 CourseFolderCard */}
              <View style={styles.folderGrid}>
                {COURSES.map((course) => {
                  const count = taskCountsByCourse[course.id] || 0;
                  return (
                    <View key={course.id} style={styles.gridColumnItem}>
                      <CourseFolderCard
                        course={course}
                        activeTaskCount={count}
                        onPress={() => setSelectedCourseFilter(course)}
                      />
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* ============================================================== */}
      {/* 3. MODE TAMPILAN "Tugas" / "Chats" (Mengacu Layar Kanan reference.jpg) */}
      {/* ============================================================== */}
      {activeTab === 'tugas' && (
        <ScrollView
          style={styles.screenScroll}
          contentContainerStyle={styles.chatsScrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header Layar Chats: "Chats", jumlah tugas, tombol '+' */}
          <View style={styles.chatsHeaderRow}>
            <Text style={styles.chatsLargeTitle}>Semua Tugas</Text>
            <View style={styles.chatsHeaderRight}>
              <Text style={styles.chatsCountLabel}>{activeTasksCount} tugas</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tambah tugas baru"
                onPress={() => openForm()}
                style={({ pressed }) => [styles.matkulPlusBtn, pressed && styles.btnPressed]}>
                <Text style={styles.matkulPlusText}>+</Text>
              </Pressable>
            </View>
          </View>

          {isEmpty ? (
            <View style={styles.emptyCard}>
              <Image
                source={emptyChatsIcon}
                style={styles.emptyCardIcon3D}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>Belum ada tugas</Text>
              <Text style={styles.emptySubtitle}>
                Catat tugas pertamamu agar tampil sebagai bubble di sini.
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tambah tugas baru"
                onPress={() => openForm()}
                style={({ pressed }) => [styles.emptyBigButton, pressed && styles.btnPressed]}>
                <Text style={styles.emptyBigButtonText}>+ Tambah Tugas Baru</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Aliran Tugas Bubble Penuh */}
              {activeSections.map(
                (s) =>
                  s.items.length > 0 && (
                    <View key={s.key} style={styles.groupSection}>
                      <Text style={styles.groupHeaderLabel}>
                        {s.label} ({s.items.length})
                      </Text>
                      {s.items.map((t) => (
                        <TaskCard
                          key={t.id}
                          task={t}
                          variant={s.variant}
                          onToggleDone={handleToggle}
                          onPress={openDetail}
                        />
                      ))}
                    </View>
                  )
              )}

              {/* Akordeon Kelompok Selesai */}
              {doneCount > 0 && (
                <View style={styles.groupSection}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: doneOpen }}
                    onPress={() => setDoneOpen((v) => !v)}
                    style={styles.accordionHeader}>
                    <Text style={styles.accordionTitle}>
                      {doneOpen ? '▾' : '▸'} Selesai ({doneCount})
                    </Text>
                  </Pressable>
                  {doneOpen &&
                    groups.completed.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        variant="done"
                        onToggleDone={handleToggle}
                        onPress={openDetail}
                      />
                    ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}

      {/* ============================================================== */}
      {/* 4. FLOATING PILL DOCK (Mengambang di Bawah Layar untuk 3 Tampilan) */}
      {/* ============================================================== */}
      <FloatingActionPill
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedCourseFilter(null);
        }}
        onPressAdd={() => openForm(selectedCourseFilter ? selectedCourseFilter.fullName : undefined)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161513', // Latar dasar gelap pekat agar notch/status bar menyatu
  },
  screenScroll: {
    flex: 1,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  /* ------------------------------------------------------------- */
  /* GAYA LAYAR 1: TODAY                                           */
  /* ------------------------------------------------------------- */
  todayScrollContent: {
    flexGrow: 1,
    backgroundColor: '#161513',
  },
  heroDarkTop: {
    backgroundColor: '#161513',
    paddingTop: 54, // Aman dari notch / status bar
    paddingHorizontal: spacing.space5,
    paddingBottom: spacing.space6,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space5,
  },
  heroBrandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space2,
  },
  heroBrandLogo: {
    width: 28,
    height: 28,
    borderRadius: 7,
  },
  heroBrandText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orangeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#ff8c21', // Titik oranye terang seperti pada reference
  },
  heroDateText: {
    fontSize: typography.sizes.xs + 1,
    color: '#a39e97',
    fontWeight: typography.weights.medium,
  },
  heroSummaryBody: {
    gap: spacing.space3,
  },
  narrativeText: {
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  textBrightWhite: {
    color: '#ffffff',
    fontWeight: '700',
  },
  textMutedDark: {
    color: '#a39e97',
    fontWeight: '400',
  },
  heroInlineIcon: {
    width: typography.sizes.xl,
    height: typography.sizes.xl,
    marginHorizontal: spacing.space1,
    verticalAlign: 'middle',
  },
  heroMetaLine: {
    fontSize: typography.sizes.xs + 1,
    color: '#7a756f',
    marginTop: 2,
  },
  todaySheetContainer: {
    flex: 1,
    backgroundColor: colors.bg, // Kanvas terang #f8f5f0
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: spacing.space5,
    paddingHorizontal: spacing.space4,
    paddingBottom: 110, // Ruang untuk floating pill dock
    minHeight: 460,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space4,
    paddingHorizontal: 4,
  },
  sheetHeaderTitle: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  sheetHeaderCount: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },

  /* ------------------------------------------------------------- */
  /* GAYA LAYAR 2: MATKUL (SAVED)                                   */
  /* ------------------------------------------------------------- */
  matkulScrollContent: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    paddingTop: 54,
    paddingHorizontal: spacing.space4,
    paddingBottom: 110,
  },
  matkulHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space5,
    paddingHorizontal: 4,
  },
  matkulLargeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  matkulHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
  },
  matkulCountLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  matkulPlusBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  matkulPlusText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: -2,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.space3,
  },
  gridColumnItem: {
    width: '48%',
  },

  /* Detail Filter Matkul */
  courseFilterView: {
    gap: spacing.space4,
  },
  backMatkulBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: spacing.space3,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  backMatkulText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  courseHeroBanner: {
    borderRadius: radius.lg,
    paddingVertical: spacing.space5,
    paddingHorizontal: spacing.space5,
    ...shadows.sm,
  },
  courseHeroTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '800',
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  courseTaskListWrap: {
    gap: spacing.space2,
  },
  courseTaskHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.space2,
  },
  courseTaskHeaderTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  smallAddPill: {
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: spacing.space3,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  smallAddPillText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textOnDark,
  },
  emptyCourseBox: {
    padding: spacing.space6,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.space2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  emptyCourseIcon3D: {
    width: 48,
    height: 48,
    marginBottom: spacing.space1,
  },
  emptyCourseTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.space1,
  },
  emptyCourseSubtitle: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.space2,
  },
  emptyBigButton: {
    width: '100%',
    minHeight: controls.controlH,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.space4,
    marginTop: spacing.space1,
    ...shadows.sm,
  },
  emptyBigButtonText: {
    color: colors.textOnDark,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },

  /* ------------------------------------------------------------- */
  /* GAYA LAYAR 3: CHATS (TUGAS)                                   */
  /* ------------------------------------------------------------- */
  chatsScrollContent: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    paddingTop: 54,
    paddingHorizontal: spacing.space4,
    paddingBottom: 110,
  },
  chatsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.space5,
    paddingHorizontal: 4,
  },
  chatsLargeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  chatsHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space3,
  },
  chatsCountLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },

  /* ------------------------------------------------------------- */
  /* BAGIAN GRUP TUGAS & ELEMEN UMUM                               */
  /* ------------------------------------------------------------- */
  groupSection: {
    marginBottom: spacing.space3,
    gap: spacing.space2,
  },
  groupHeaderLabel: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
    marginBottom: 2,
  },
  urgentHeaderLabel: {
    color: colors.urgent.text,
  },
  highlightListSection: {
    gap: spacing.space2,
    marginBottom: spacing.space3,
  },
  accordionHeader: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  accordionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
  },
  emptyCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.space2,
    padding: spacing.space8,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.space4,
    ...shadows.sm,
  },
  emptyCardIcon3D: {
    width: 54,
    height: 54,
    marginBottom: spacing.space1,
  },
  emptyTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: typography.sizes.xs + 1,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
