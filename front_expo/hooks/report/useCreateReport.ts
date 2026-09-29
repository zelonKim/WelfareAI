import { submitReport } from '@/api/report/submitReport';
import { CreateReportPayload } from '@/types/report/CreateReportPayload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

export const useCreateReport = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: submitReport,
    onSuccess: (data) => {
      Alert.alert('알림', data.message || '신고가 접수되었습니다.');
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: Error) => {
      Alert.alert('신고 실패', error.message);
    },
  });
};