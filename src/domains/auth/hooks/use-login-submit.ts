'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../login.schema';
import { authMessages } from '../messages';

type UseLoginSubmitOptions = {
  /**
   * Plug the real sign-in call here. Throw an Error (its message is shown)
   * or call `setRootError` to show a form-level error such as wrong credentials.
   */
  onLogin?: (input: LoginInput) => void | Promise<void>;
};

async function noopLogin() {}

export function useLoginSubmit({
  onLogin = noopLogin
}: UseLoginSubmitOptions = {}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = handleSubmit(async values => {
    try {
      await onLogin(values);
    } catch (error) {
      setError('root', {
        message:
          error instanceof Error && error.message
            ? error.message
            : authMessages.login.genericError
      });
    }
  });

  function setRootError(message: string) {
    setError('root', { message });
  }

  return {
    register,
    onSubmit,
    errors,
    isSubmitting,
    isValid,
    setRootError
  };
}
