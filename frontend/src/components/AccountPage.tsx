import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react'
import type { ProfileFormValues, PublicUser } from '../types'

type AccountPageProps = {
  user: PublicUser
  onBackToBoard: () => void
  onLogout: () => void
  onSaveProfile?: (values: ProfileFormValues) => void | Promise<void>
  onDeleteAccount?: () => void | Promise<void>
  isSaving?: boolean
  isDeleting?: boolean
  saveError?: string
  deleteError?: string
}

type ProfileErrors = Partial<Record<keyof ProfileFormValues, string>>

const emailPattern = /^\S+@\S+\.\S+$/

const AccountPage = ({
  user,
  onBackToBoard,
  onLogout,
  onSaveProfile,
  onDeleteAccount,
  isSaving = false,
  isDeleting = false,
  saveError,
  deleteError,
}: AccountPageProps) => {
  const [profile, setProfile] = useState<ProfileFormValues>({
    username: user.username,
    email: user.email,
  })
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({})
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deletePhrase, setDeletePhrase] = useState('')

  const trimmedProfile = {
    username: profile.username.trim(),
    email: profile.email.trim(),
  }
  const profileChanged =
    trimmedProfile.username !== user.username || trimmedProfile.email !== user.email

  const joinedDate = new Date(user.createdAt)
  const joinedDateLabel = Number.isNaN(joinedDate.getTime())
    ? user.createdAt
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: 'long',
      }).format(joinedDate)
    
  useEffect(() => {
  if (user) {
    setProfile({
      username: user.username,
      email: user.email,
    });
  }
}, [user]);
  const initials =
    user.username
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || user.email[0]?.toUpperCase() || 'U'

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as keyof ProfileFormValues
    const { value } = event.target

    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }))

    setProfileErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }))
  }

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: ProfileErrors = {}

    if (!trimmedProfile.username) {
      nextErrors.username = 'Username is required'
    }

    if (!trimmedProfile.email) {
      nextErrors.email = 'Email is required'
    } else if (!emailPattern.test(trimmedProfile.email)) {
      nextErrors.email = 'Enter a valid email address'
    }

    setProfileErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !onSaveProfile || !profileChanged) {
      return
    }

    void onSaveProfile(trimmedProfile)
  }

  const resetProfile = () => {
    setProfile({
      username: user.username,
      email: user.email,
    })
    setProfileErrors({})
  }

  const openDeleteConfirmation = () => {
    setShowDeleteConfirmation(true)
    setDeletePhrase('')
  }

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false)
    setDeletePhrase('')
  }

  const handleDeleteAccount = () => {
    if (deletePhrase !== 'DELETE' || !onDeleteAccount) {
      return
    }

    void onDeleteAccount()
  }

  const fieldClassName = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 sm:text-sm ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'
    }`

  return (
    <main className='min-h-screen bg-slate-100 px-3 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
      <div className='mx-auto max-w-6xl'>
        <header className='mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:p-6'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex min-w-0 items-center gap-4'>
              <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black tracking-wide text-white shadow-sm'>
                {initials}
              </span>
              <div className='min-w-0'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>Account</p>
                <h1 className='truncate text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl'>Account settings</h1>
                <p className='mt-1 truncate text-sm text-slate-500'>{user.email}</p>
              </div>
            </div>

            <nav aria-label='Account navigation' className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={onBackToBoard}
                className='rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200'
              >
                Board
              </button>
              <button
                type='button'
                onClick={onLogout}
                className='rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200'
              >
                Log out
              </button>
            </nav>
          </div>
        </header>

        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]'>
          <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7'>
            <div className='mb-6'>
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-violet-600'>Profile</p>
              <h2 className='mt-2 text-xl font-bold text-slate-950 sm:text-2xl'>Personal details</h2>
              <p className='mt-2 text-sm leading-relaxed text-slate-600'>Update the name and email associated with your workspace.</p>
            </div>

            <form onSubmit={handleProfileSubmit} noValidate className='space-y-5'>
              <div className='space-y-2'>
                <label htmlFor='account-username' className='block text-sm font-semibold text-slate-700'>
                  Username
                </label>
                <input
                  id='account-username'
                  name='username'
                  type='text'
                  value={profile.username}
                  onChange={handleProfileChange}
                  autoComplete='username'
                  required
                  aria-invalid={Boolean(profileErrors.username)}
                  aria-describedby={profileErrors.username ? 'account-username-error' : undefined}
                  className={fieldClassName(Boolean(profileErrors.username))}
                />
                {profileErrors.username && (
                  <p id='account-username-error' role='alert' className='text-xs font-medium text-red-600'>
                    {profileErrors.username}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label htmlFor='account-email' className='block text-sm font-semibold text-slate-700'>
                  Email address
                </label>
                <input
                  id='account-email'
                  name='email'
                  type='email'
                  value={profile.email}
                  onChange={handleProfileChange}
                  autoComplete='email'
                  required
                  aria-invalid={Boolean(profileErrors.email)}
                  aria-describedby={profileErrors.email ? 'account-email-error' : 'account-email-help'}
                  className={fieldClassName(Boolean(profileErrors.email))}
                />
                {profileErrors.email ? (
                  <p id='account-email-error' role='alert' className='text-xs font-medium text-red-600'>
                    {profileErrors.email}
                  </p>
                ) : (
                  <p id='account-email-help' className='text-xs leading-relaxed text-slate-500'>Changing your email does not change the current access token.</p>
                )}
              </div>

              {saveError && (
                <p role='alert' className='rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700'>
                  {saveError}
                </p>
              )}

              {!onSaveProfile && (
                <p className='rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-medium leading-relaxed text-violet-800'>
                  UI ready. Connect the profile update callback to enable saving.
                </p>
              )}

              <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                <button
                  type='button'
                  onClick={resetProfile}
                  disabled={!profileChanged || isSaving}
                  className='rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Reset
                </button>
                <button
                  type='submit'
                  disabled={!onSaveProfile || !profileChanged || isSaving}
                  className='rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500'
                >
                  {isSaving ? 'Saving changes...' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>

          <aside className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>Account information</p>
            <h2 className='mt-2 text-xl font-bold text-slate-950'>Workspace identity</h2>

            <dl className='mt-6 space-y-5'>
              <div>
                <dt className='text-xs font-semibold uppercase tracking-wider text-slate-400'>Username</dt>
                <dd className='mt-1 text-sm font-semibold text-slate-900'>{user.username}</dd>
              </div>
              <div>
                <dt className='text-xs font-semibold uppercase tracking-wider text-slate-400'>Member since</dt>
                <dd className='mt-1 text-sm text-slate-700'>
                  <time dateTime={user.createdAt}>{joinedDateLabel}</time>
                </dd>
              </div>
              <div>
                <dt className='text-xs font-semibold uppercase tracking-wider text-slate-400'>User ID</dt>
                <dd className='mt-1 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs leading-relaxed text-slate-600'>{user.id}</dd>
              </div>
            </dl>

            <div className='mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-sm font-semibold text-slate-800'>Password management</p>
              <p className='mt-1 text-xs leading-relaxed text-slate-500'>Password changes are not shown because the backend does not currently provide a password update or reset endpoint.</p>
            </div>
          </aside>
        </div>

        <section className='mt-6 rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-7'>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-red-600'>Danger zone</p>
              <h2 className='mt-2 text-xl font-bold text-slate-950'>Delete this account</h2>
              <p className='mt-2 text-sm leading-relaxed text-slate-600'>This action is permanent. The backend is configured to delete tasks owned by this account along with the user.</p>
            </div>

            {!showDeleteConfirmation && (
              <button
                type='button'
                onClick={openDeleteConfirmation}
                className='self-start rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100'
              >
                Delete account...
              </button>
            )}
          </div>

          {showDeleteConfirmation && (
            <div className='mt-6 rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5'>
              <p className='text-sm font-semibold text-red-900'>Confirm permanent deletion</p>
              <p className='mt-1 text-sm leading-relaxed text-red-800'>Type <strong>DELETE</strong> to confirm that you understand this cannot be undone.</p>

              <div className='mt-4 max-w-md space-y-2'>
                <label htmlFor='delete-confirmation' className='block text-sm font-semibold text-red-900'>
                  Confirmation phrase
                </label>
                <input
                  id='delete-confirmation'
                  type='text'
                  value={deletePhrase}
                  onChange={(event) => setDeletePhrase(event.target.value)}
                  autoComplete='off'
                  placeholder='DELETE'
                  className='w-full rounded-xl border border-red-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 sm:text-sm'
                />
              </div>

              {deleteError && (
                <p role='alert' className='mt-4 rounded-xl border border-red-300 bg-white px-3 py-2.5 text-sm font-medium text-red-700'>
                  {deleteError}
                </p>
              )}

              {!onDeleteAccount && (
                <p className='mt-4 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-medium leading-relaxed text-red-800'>
                  UI ready. Connect the account deletion callback to enable the final action.
                </p>
              )}

              <div className='mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                <button
                  type='button'
                  onClick={closeDeleteConfirmation}
                  disabled={isDeleting}
                  className='rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleDeleteAccount}
                  disabled={!onDeleteAccount || deletePhrase !== 'DELETE' || isDeleting}
                  className='rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-red-200 disabled:text-red-500'
                >
                  {isDeleting ? 'Deleting account...' : 'Delete account permanently'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AccountPage
