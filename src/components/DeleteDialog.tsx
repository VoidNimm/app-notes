import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { DesignTokens } from '@/constants/theme';

const { colors, spacing, radius, typography, controls } = DesignTokens;

export interface DeleteDialogProps {
  visible: boolean;
  taskTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteDialog({
  visible,
  taskTitle,
  onCancel,
  onConfirm,
  isDeleting = false,
}: DeleteDialogProps) {
  const message = `Hapus tugas '${taskTitle}'? Pengingat terjadwal ikut dibatalkan dan tindakan ini tidak dapat diurungkan.`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Tutup dialog" />
        <View style={styles.card} accessibilityRole="alert">
          <Text style={styles.title}>Hapus Tugas</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Batal menghapus tugas"
              disabled={isDeleting}
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Konfirmasi hapus tugas"
              disabled={isDeleting}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.deleteButton,
                pressed && styles.buttonPressed,
                isDeleting && styles.buttonDisabled,
              ]}>
              <Text style={styles.deleteButtonText}>
                {isDeleting ? 'Menghapus…' : 'Hapus'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.space4,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.space5,
    ...DesignTokens.shadows.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.space2,
  },
  message: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.space5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.space3,
  },
  button: {
    minHeight: controls.controlH,
    minWidth: 88,
    paddingHorizontal: spacing.space4,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  deleteButton: {
    backgroundColor: colors.urgent.bg,
    borderWidth: 1,
    borderColor: colors.urgent.text,
  },
  deleteButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.urgent.text,
  },
});

export default DeleteDialog;
