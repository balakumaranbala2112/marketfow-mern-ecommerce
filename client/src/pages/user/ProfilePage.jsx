import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  useChangePassword,
  useDeleteAvatar,
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from "../../features/user/hooks/useUser.js";

import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";

import PageLoader from "../../components/common/PageLoader.jsx";

function ProfilePage() {
  const addToast = useToastStore((state) => state.addToast);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);

  const { data: profile, isLoading } = useProfile();

  const updateMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const [activeSection, setActiveSection] = useState("profile");

  if (isLoading) {
    return (
      <main className="min-h-[65vh] bg-surface-muted">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
          <PageLoader />
        </div>
      </main>
    );
  }

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    uploadAvatarMutation.mutate(formData, {
      onSuccess: (response) => {
        const updatedUser = response.data.data.user;

        setUser(updatedUser);

        addToast({
          type: "success",
          message: "Profile photo updated",
        });
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message,
        });
      },
    });
  }

  function handleAvatarDelete() {
    deleteAvatarMutation.mutate(undefined, {
      onSuccess: (response) => {
        const updatedUser = response?.data?.data?.user;

        if (updatedUser) {
          setUser(updatedUser);
        } else {
          setUser({
            ...profile,
            avatar: null,
          });
        }

        addToast({
          type: "success",
          message: "Profile photo removed",
        });
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message,
        });
      },
    });
  }

  return (
    <main className="min-h-screen bg-surface-muted">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-700">
            Account settings
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-primary-950 sm:text-4xl">
            Your profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            Manage your personal information, profile photo, and account
            password.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="overflow-hidden rounded-lg border border-border bg-white shadow-[0_2px_8px_rgba(15,24,32,0.07)]">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                {profile?.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={`${profile?.name || "User"} profile`}
                    className="h-20 w-20 rounded-full border border-border object-cover sm:h-24 sm:w-24"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-primary-100 text-2xl font-extrabold text-primary-700 sm:h-24 sm:w-24 sm:text-3xl">
                    {getInitial(profile?.name)}
                  </div>
                )}

                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary-950/55 text-white">
                    <LoaderCircle
                      size={22}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-extrabold tracking-[-0.02em] text-primary-950 sm:text-2xl">
                  {profile?.name || "MarketFlow customer"}
                </h2>

                <p className="mt-1 truncate text-sm text-text-muted">
                  {profile?.email}
                </p>

                <span className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                  <CheckCircle2 size={14} aria-hidden="true" />
                  Active account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <label
                className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-4 text-sm font-bold text-primary-950 transition hover:bg-accent-300 ${
                  uploadAvatarMutation.isPending
                    ? "pointer-events-none opacity-60"
                    : ""
                }`}
              >
                <Camera size={16} aria-hidden="true" />
                Change photo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleAvatarUpload}
                  disabled={uploadAvatarMutation.isPending}
                />
              </label>

              <button
                type="button"
                onClick={handleAvatarDelete}
                disabled={
                  !profile?.avatar?.url || deleteAvatarMutation.isPending
                }
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-border-strong bg-white px-4 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {deleteAvatarMutation.isPending ? (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Trash2 size={16} aria-hidden="true" />
                )}
                Remove
              </button>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
          <aside>
            <nav
              className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-white p-2 shadow-[0_1px_4px_rgba(15,24,32,0.05)] md:grid-cols-1"
              aria-label="Profile settings"
            >
              <NavigationButton
                active={activeSection === "profile"}
                icon={UserRound}
                title="Personal details"
                description="Name and phone"
                onClick={() => setActiveSection("profile")}
              />

              <NavigationButton
                active={activeSection === "password"}
                icon={LockKeyhole}
                title="Password"
                description="Account security"
                onClick={() => setActiveSection("password")}
              />
            </nav>

            <div className="mt-4 hidden rounded-lg border border-border bg-surface-subtle p-4 md:block">
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-green-700"
                  aria-hidden="true"
                />

                <p className="text-xs leading-5 text-text-muted">
                  Keep your contact information current and use a unique
                  password for this account.
                </p>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            {activeSection === "profile" ? (
              <ProfileForm
                profile={profile}
                updateMutation={updateMutation}
                setUser={setUser}
                addToast={addToast}
              />
            ) : (
              <PasswordForm
                changePasswordMutation={changePasswordMutation}
                setAuth={setAuth}
                addToast={addToast}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function NavigationButton({ active, icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[64px] items-center gap-3 rounded-md px-3 py-2.5 text-left transition ${
        active
          ? "bg-primary-950 text-white"
          : "text-primary-800 hover:bg-primary-50 hover:text-primary-950"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
          active
            ? "bg-white/10 text-accent-300"
            : "bg-primary-50 text-primary-700"
        }`}
      >
        <Icon size={17} aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold">{title}</span>

        <span
          className={`mt-0.5 hidden truncate text-xs md:block ${
            active ? "text-primary-300" : "text-text-soft"
          }`}
        >
          {description}
        </span>
      </span>
    </button>
  );
}

function ProfileForm({ profile, updateMutation, setUser, addToast }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    values: {
      name: profile?.name || "",
      phone: profile?.phone || "",
    },
  });

  function onSubmit(data) {
    updateMutation.mutate(data, {
      onSuccess: (response) => {
        setUser(response.data.data.user);

        addToast({
          type: "success",
          message: "Profile details updated",
        });
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message,
        });
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]"
      noValidate
    >
      <FormHeader
        title="Personal details"
        description="Update the information used for your MarketFlow account."
      />

      <div className="space-y-5 p-5 sm:p-6">
        <Field
          id="profile-name"
          label="Full name"
          icon={UserRound}
          error={errors.name?.message}
        >
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            className={getInputClasses(Boolean(errors.name))}
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must contain at least 2 characters",
              },
              maxLength: {
                value: 80,
                message: "Name must not exceed 80 characters",
              },
            })}
          />
        </Field>

        <Field
          id="profile-phone"
          label="Phone number"
          icon={Phone}
          error={errors.phone?.message}
          optional
        >
          <input
            id="profile-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
            className={getInputClasses(Boolean(errors.phone))}
            {...register("phone", {
              pattern: {
                value: /^[0-9+\-\s()]{7,20}$/,
                message: "Enter a valid phone number",
              },
            })}
          />
        </Field>

        <Field id="profile-email" label="Email address" icon={Mail}>
          <input
            id="profile-email"
            type="email"
            value={profile?.email || ""}
            disabled
            readOnly
            className={`${getInputClasses(false)} cursor-not-allowed bg-primary-50 text-text-muted`}
          />
        </Field>

        <div className="rounded-md border border-border bg-surface-subtle px-3.5 py-3">
          <p className="text-xs leading-5 text-text-muted">
            Email changes are disabled on this page because they usually require
            a separate verification flow.
          </p>
        </div>
      </div>

      <FormFooter>
        <button
          type="submit"
          disabled={updateMutation.isPending || !isDirty}
          className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md border border-accent-600 bg-accent-400 px-5 text-sm font-extrabold text-primary-950 transition hover:bg-accent-300 disabled:cursor-not-allowed disabled:border-border disabled:bg-primary-100 disabled:text-primary-500 sm:w-auto"
        >
          {updateMutation.isPending ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
              Saving changes
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </FormFooter>
    </form>
  );
}

function PasswordForm({ changePasswordMutation, setAuth, addToast }) {
  const [visiblePasswords, setVisiblePasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  function togglePassword(field) {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function onSubmit(data) {
    changePasswordMutation.mutate(data, {
      onSuccess: (response) => {
        const { user, accessToken } = response.data.data;

        setAuth({
          user,
          accessToken,
        });

        addToast({
          type: "success",
          message: "Password changed successfully",
        });

        reset();
        setVisiblePasswords({
          current: false,
          next: false,
          confirm: false,
        });
      },
      onError: (error) => {
        addToast({
          type: "error",
          message: error.message,
        });
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-border bg-white shadow-[0_1px_4px_rgba(15,24,32,0.06)]"
      noValidate
    >
      <FormHeader
        title="Change password"
        description="Confirm your current password before creating a new one."
      />

      <div className="space-y-5 p-5 sm:p-6">
        <PasswordField
          id="current-password"
          label="Current password"
          visible={visiblePasswords.current}
          onToggle={() => togglePassword("current")}
          error={errors.currentPassword?.message}
          autoComplete="current-password"
          register={register("currentPassword", {
            required: "Current password is required",
          })}
        />

        <PasswordField
          id="new-password"
          label="New password"
          visible={visiblePasswords.next}
          onToggle={() => togglePassword("next")}
          error={errors.newPassword?.message}
          autoComplete="new-password"
          register={register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Password must contain at least 8 characters",
            },
          })}
        />

        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          visible={visiblePasswords.confirm}
          onToggle={() => togglePassword("confirm")}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          register={register("confirmPassword", {
            required: "Please confirm your new password",
            validate: (value) =>
              value === newPassword || "Passwords do not match",
          })}
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <PasswordRequirement text="At least 8 characters" />
          <PasswordRequirement text="Different from other accounts" />
        </div>

        <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface-subtle px-3.5 py-3">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-green-700"
            aria-hidden="true"
          />

          <p className="text-xs leading-5 text-text-muted">
            Changing the password may issue a new access token for the current
            session.
          </p>
        </div>
      </div>

      <FormFooter>
        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md border border-primary-950 bg-primary-950 px-5 text-sm font-bold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {changePasswordMutation.isPending ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
              Updating password
            </>
          ) : (
            "Change password"
          )}
        </button>
      </FormFooter>
    </form>
  );
}

function FormHeader({ title, description }) {
  return (
    <div className="border-b border-border px-5 py-4 sm:px-6">
      <h2 className="text-lg font-extrabold tracking-[-0.02em] text-primary-950">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-text-muted">{description}</p>
    </div>
  );
}

function FormFooter({ children }) {
  return (
    <div className="flex justify-end border-t border-border bg-surface-subtle px-5 py-4 sm:px-6">
      {children}
    </div>
  );
}

function Field({ id, label, icon: Icon, error, optional = false, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-primary-950">
          {label}
        </label>

        {optional && (
          <span className="text-xs font-medium text-text-soft">Optional</span>
        )}
      </div>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-primary-500"
          aria-hidden="true"
        />

        {children}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordField({
  id,
  label,
  visible,
  onToggle,
  error,
  register,
  autoComplete,
}) {
  return (
    <Field id={id} label={label} icon={LockKeyhole} error={error}>
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={`Enter ${label.toLowerCase()}`}
        className={`${getInputClasses(Boolean(error))} pr-12`}
        {...register}
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-primary-500 transition hover:bg-primary-50 hover:text-primary-900"
        aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff size={17} aria-hidden="true" />
        ) : (
          <Eye size={17} aria-hidden="true" />
        )}
      </button>
    </Field>
  );
}

function PasswordRequirement({ text }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface-subtle px-3 py-2.5">
      <CheckCircle2
        size={15}
        className="shrink-0 text-green-700"
        aria-hidden="true"
      />

      <span className="text-xs font-medium text-text-muted">{text}</span>
    </div>
  );
}

function getInputClasses(hasError) {
  return `min-h-[46px] w-full rounded-md border bg-white py-2.5 pl-10 pr-3 text-sm text-text outline-none placeholder:text-text-soft ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
      : "border-border-strong focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,154,0,0.16)]"
  }`;
}

function getInitial(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

export default ProfilePage;
