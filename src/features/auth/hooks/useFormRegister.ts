import { registerSchema, RegisterFormValues } from '@/features/auth/schemas';
import { useRegisterUser } from './useRegisterUser';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
      onSuccess: () => {
        router.push('/profile');
      },
    });
  };

  return {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    role,
    onSubmit,
  };
}
