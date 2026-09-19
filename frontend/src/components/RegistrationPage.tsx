import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import type { RegistrationValues } from '../types'

type RegistrationPageProps = {
  onBackToLogin: () => void
  onRegister?: (values: RegistrationValues) => void | Promise<void>
  isSubmitting?: boolean
  submissionError?: string
}

type RegistrationDraft = RegistrationValues & {
  confirmPassword: string
}

type RegistrationField = keyof RegistrationDraft

type RegistrationErrors = Partial<Record<RegistrationField, string>>

const emailPattern = /^\S+@\S+\.\S+$/

const RegistrationPage = ({
  onBackToLogin,
  onRegister,
  isSubmitting = false,
  submissionError,
}: RegistrationPageProps) => {
  const [formData, setFormData] = useState<RegistrationDraft>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<RegistrationErrors>({})

  const validateField = (field: RegistrationField, values: RegistrationDraft) => {
    if (field === 'username') {
      return values.username.trim() ? undefined : 'Username is required'
    }

    if (field === 'email') {
      const email = values.email.trim()

      if (!email) {
        return 'Email is required'
      }

      return emailPattern.test(email) ? undefined : 'Enter a valid email address'
    }

    if (field === 'password') {
      if (!values.password) {
        return 'Password is required'
      }

      return values.password.length >= 8 ? undefined : 'Use at least 8 characters'
    }

    if (!values.confirmPassword) {
      return 'Confirm your password'
    }

    return values.confirmPassword === values.password ? undefined : 'Passwords do not match'
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as RegistrationField
    const { value } = event.target

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))

    setErrors((previous) => {
      const nextErrors = {
        ...previous,
        [field]: undefined,
      }

      if (field === 'password') {
        nextErrors.confirmPassword = undefined
      }

      return nextErrors
    })
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const field = event.target.name as RegistrationField

    setErrors((previous) => ({
      ...previous,
      [field]: validateField(field, formData),
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const fields: RegistrationField[] = ['username', 'email', 'password', 'confirmPassword']
    const nextErrors = fields.reduce<RegistrationErrors>((result, field) => {
      const message = validateField(field, formData)

      if (message) {
        result[field] = message
      }

      return result
    }, {})

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !onRegister) {
      return
    }

    void onRegister({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
    })
  }

  const fieldClassName = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 sm:text-sm ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'
    }`

  return (
    <main className='min-h-screen bg-slate-950 px-4 py-6 text-slate-900 sm:px-6 sm:py-10 lg:px-8'>
      <div className='mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-slate-950/40 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.95fr_1.05fr]'>
        <section className='relative hidden overflow-hidden p-8 text-white sm:p-12 lg:flex lg:flex-col lg:justify-between'>
          <div className='absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl' />
          <div className='absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl' />

          <div className='relative'>
            <div className='mb-12 flex items-center gap-3'>
              <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg font-black text-slate-900 shadow-lg'>K</span>
              <span className='text-sm font-bold uppercase tracking-[0.24em] text-slate-300'>Kanban</span>
            </div>

            <p className='mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300'>Create your workspace</p>
            <h1 className='max-w-lg text-4xl font-bold leading-tight tracking-tight xl:text-5xl'>Give every task a clear next step.</h1>
            <p className='mt-6 max-w-md text-base leading-relaxed text-slate-300'>Create an account to keep your board tied to you and continue your work across sessions.</p>
          </div>

          <div className='relative mt-12 grid gap-3 text-sm text-slate-200'>
            {[
              ['01', 'Capture work before it gets lost'],
              ['02', 'Move tasks as progress changes'],
              ['03', 'Keep your workspace owner-scoped'],
            ].map(([number, text]) => (
              <div key={number} className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm'>
                <span className='text-xs font-bold text-violet-300'>{number}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='flex items-center justify-center bg-slate-100 p-5 sm:p-10 lg:p-12'>
          <div className='w-full max-w-lg'>
            <div className='mb-8 lg:hidden'>
              <div className='mb-6 flex items-center gap-3'>
                <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white shadow-sm'>K</span>
                <span className='text-sm font-bold uppercase tracking-[0.24em] text-slate-600'>Task organiser</span>
              </div>
            </div>

            <div className='mb-8'>
              <p className='mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>Start organizing</p>
              <h2 className='text-3xl font-bold tracking-tight text-slate-950'>Create your account</h2>
              <p className='mt-3 text-sm leading-relaxed text-slate-600'>Enter the details your registration handler will send to the backend.</p>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7'>
              <form onSubmit={handleSubmit} noValidate className='space-y-5'>
                <div className='space-y-2'>
                  <label htmlFor='register-username' className='block text-sm font-semibold text-slate-700'>
                    Username
                  </label>
                  <input
                    id='register-username'
                    name='username'
                    type='text'
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete='username'
                    required
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={errors.username ? 'register-username-error' : undefined}
                    placeholder='Your display name'
                    className={fieldClassName(Boolean(errors.username))}
                  />
                  {errors.username && (
                    <p id='register-username-error' role='alert' className='text-xs font-medium text-red-600'>
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label htmlFor='register-email' className='block text-sm font-semibold text-slate-700'>
                    Email address
                  </label>
                  <input
                    id='register-email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete='email'
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'register-email-error' : undefined}
                    placeholder='you@example.com'
                    className={fieldClassName(Boolean(errors.email))}
                  />
                  {errors.email && (
                    <p id='register-email-error' role='alert' className='text-xs font-medium text-red-600'>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className='grid gap-5 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <label htmlFor='register-password' className='block text-sm font-semibold text-slate-700'>
                      Password
                    </label>
                    <input
                      id='register-password'
                      name='password'
                      type='password'
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete='new-password'
                      required
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'register-password-error' : 'register-password-help'}
                      placeholder='At least 8 characters'
                      className={fieldClassName(Boolean(errors.password))}
                    />
                    {errors.password ? (
                      <p id='register-password-error' role='alert' className='text-xs font-medium text-red-600'>
                        {errors.password}
                      </p>
                    ) : (
                      <p id='register-password-help' className='text-xs text-slate-500'>Minimum 8 characters</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor='register-confirm-password' className='block text-sm font-semibold text-slate-700'>
                      Confirm password
                    </label>
                    <input
                      id='register-confirm-password'
                      name='confirmPassword'
                      type='password'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete='new-password'
                      required
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
                      placeholder='Repeat your password'
                      className={fieldClassName(Boolean(errors.confirmPassword))}
                    />
                    {errors.confirmPassword && (
                      <p id='register-confirm-password-error' role='alert' className='text-xs font-medium text-red-600'>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {submissionError && (
                  <p role='alert' className='rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700'>
                    {submissionError}
                  </p>
                )}

                {!onRegister && (
                  <p className='rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-medium leading-relaxed text-violet-800'>
                    UI ready. Connect the registration callback to enable account creation.
                  </p>
                )}

                <button
                  type='submit'
                  disabled={!onRegister || isSubmitting}
                  className='w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500'
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </div>

            <p className='mt-5 text-center text-sm text-slate-600'>
              Already have an account?{' '}
              <button
                type='button'
                onClick={onBackToLogin}
                className='font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200'
              >
                Sign in
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default RegistrationPage
