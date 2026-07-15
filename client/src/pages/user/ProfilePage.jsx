import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Lock, Camera, Trash2 } from "lucide-react";

import { useProfile, useUpdateProfile, useChangePassword, useUploadAvatar, useDeleteAvatar } from "../../features/user/hooks/useUser.js";
import useAuthStore from "../../stores/authStore.js";
import useToastStore from "../../stores/toastStore.js";
import PageLoader from "../../components/common/PageLoader.jsx";
import FormInput from "../../components/common/FormInput.jsx";

function ProfilePage() {
  const addToast = useToastStore((s) => s.addToast);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const [tab, setTab] = useState("profile");

  if (isLoading) return <PageLoader />;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Account</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Your Profile</h1>

      {/* Avatar */}
      <div className="mt-8 flex items-center gap-5">
        <div className="relative">
          {profile?.avatar?.url ? (
            <img src={profile.avatar.url} alt="Avatar" className="h-20 w-20 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-400">
              {profile?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-slate-950 text-white shadow hover:bg-slate-800">
            <Camera size={14} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("avatar", file);
                uploadAvatarMutation.mutate(fd, {
                  onSuccess: (res) => {
                    setUser(res.data.data.user);
                    addToast({ type: "success", message: "Avatar updated!" });
                  },
                  onError: (err) => addToast({ type: "error", message: err.message }),
                });
              }}
            />
          </label>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{profile?.name}</h2>
          <p className="text-sm text-slate-500">{profile?.email}</p>
          {profile?.avatar?.url && (
            <button
              onClick={() => deleteAvatarMutation.mutate(undefined, {
                onSuccess: () => addToast({ type: "success", message: "Avatar removed" }),
              })}
              className="mt-1 flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            >
              <Trash2 size={12} /> Remove avatar
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setTab("profile")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${tab === "profile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <User size={16} /> Profile
        </button>
        <button
          onClick={() => setTab("password")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${tab === "password" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Lock size={16} /> Password
        </button>
      </div>

      {/* Profile Tab */}
      {tab === "profile" && <ProfileForm profile={profile} updateMutation={updateMutation} setUser={setUser} addToast={addToast} />}

      {/* Password Tab */}
      {tab === "password" && <PasswordForm changePasswordMutation={changePasswordMutation} setAuth={setAuth} addToast={addToast} />}
    </main>
  );
}

function ProfileForm({ profile, updateMutation, setUser, addToast }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: profile?.name || "", phone: profile?.phone || "" },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data, {
      onSuccess: (res) => {
        setUser(res.data.data.user);
        addToast({ type: "success", message: "Profile updated!" });
      },
      onError: (err) => addToast({ type: "error", message: err.message }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <FormInput label="Full Name" id="prof-name" register={register("name", { required: "Required" })} error={errors.name?.message} />
      <FormInput label="Phone" id="prof-phone" type="tel" register={register("phone")} />
      <FormInput label="Email" id="prof-email" value={profile?.email} disabled />
      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

function PasswordForm({ changePasswordMutation, setAuth, addToast }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: (res) => {
        const { user, accessToken } = res.data.data;
        setAuth({ user, accessToken });
        addToast({ type: "success", message: "Password changed!" });
        reset();
      },
      onError: (err) => addToast({ type: "error", message: err.message }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <FormInput label="Current Password" id="pw-current" type="password" register={register("currentPassword", { required: "Required" })} error={errors.currentPassword?.message} />
      <FormInput label="New Password" id="pw-new" type="password" register={register("newPassword", { required: "Required", minLength: { value: 8, message: "At least 8 characters" } })} error={errors.newPassword?.message} />
      <FormInput label="Confirm New Password" id="pw-confirm" type="password" register={register("confirmPassword", { required: "Required" })} error={errors.confirmPassword?.message} />
      <button
        type="submit"
        disabled={changePasswordMutation.isPending}
        className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {changePasswordMutation.isPending ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}

export default ProfilePage;
