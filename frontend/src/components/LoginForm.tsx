import { useState, type ChangeEvent, type FormEvent, type SubmitEvent} from 'react'

type LoginCredentials = {
  email: string
  password: string
}

type LoginFormProps = {
  onSubmit: (credentials: LoginCredentials) => void
  isSubmitting: boolean
}

type LoginErrors = {
  email?: string
  password?: string
}

const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps ) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginErrors>({})

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }))
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: LoginErrors = {}
    const trimmedEmail = formData.email.trim()

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      email: trimmedEmail,
      password: formData.password,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className='space-y-5'>
      <div className='space-y-2'>
        <label htmlFor='login-email' className='block text-sm font-semibold text-slate-700'>
          Email address
        </label>
        <input
          id='login-email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          autoComplete='email'
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          placeholder='you@example.com'
          className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 sm:text-sm ${
            errors.email
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'
          }`}
        />
        {errors.email && (
          <p id='login-email-error' role='alert' className='text-xs font-medium text-red-600'>
            {errors.email}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between gap-3'>
          <label htmlFor='login-password' className='block text-sm font-semibold text-slate-700'>
            Password
          </label>
          <span className='text-xs text-slate-400'>Keep it private</span>
        </div>
        <input
          id='login-password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          autoComplete='current-password'
          required
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          placeholder='Enter your password'
          className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 sm:text-sm ${
            errors.password
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'
          }`}
        />
        {errors.password && (
          <p id='login-password-error' role='alert' className='text-xs font-medium text-red-600'>
            {errors.password}
          </p>
        )}
      </div>

      <button
        type='submit'
        className='w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200'
        disabled={isSubmitting}
      >
        {isSubmitting? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}

export type { LoginCredentials }
export default LoginForm
