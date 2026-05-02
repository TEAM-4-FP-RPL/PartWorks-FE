import { registerSchema, RegisterFormValues } from '@/features/auth/schemas';
import { useRegisterUser } from './useRegisterUser';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth';

export function useFormRegister() {
  const { mutate } = useRegisterUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'worker',
      email: '',
      password: '',
    },
  });

  const role = useWatch({ control, name: 'role' });

  const onSubmit = (data: RegisterFormValues) => {
    mutate(data, {
      onSuccess: (res) => {
        if (res?.token) {
          useAuthStore.getState().setToken(res.token);
          useAuthStore.getState().setUser(res);
        }
        router.push('/profile');
      },
    });
  };

  return {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    role,
    onSubmit,
  };
}
