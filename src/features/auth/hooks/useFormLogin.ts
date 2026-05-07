import { useForm } from 'react-hook-form';
import { loginSchema, LoginFormValues } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginUser } from './useLoginUser';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export function useFormLogin() {
  const { mutate } = useLoginUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: (res) => {
        if (res?.token) {
          useAuthStore.getState().setToken(res.token);
          useAuthStore.getState().setUser(res);
        }
        router.push('/');
      },
    });
  };

  return { register, handleSubmit, errors, onSubmit };
}
