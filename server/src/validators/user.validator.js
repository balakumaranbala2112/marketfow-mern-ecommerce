import {
    isNonEmptyString,
    isOptionalImageObject,
    isOptionalString
} from "../utils/validators.js";

const allowedProfileUpdateFields = ["name", "phone", "avatar"];

const allowedPasswordChangeFields = [
    "currentPassword",
    "newPassword",
    "confirmPassword"
];

function validateUpdateProfile(body) {
    const errors = [];
    const bodyKeys = Object.keys(body);

    if (bodyKeys.length === 0) {
        errors.push("At least one profile field is required for update");
    }

    bodyKeys.forEach((key) => {
        if (!allowedProfileUpdateFields.includes(key)) {
            errors.push(`${key} is not an allowed profile update field`);
        }
    });

    if (body.name !== undefined && !isNonEmptyString(body.name)) {
        errors.push("Name must be a non-empty string");
    }

    if (isNonEmptyString(body.name) && body.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters");
    }

    if (isNonEmptyString(body.name) && body.name.trim().length > 60) {
        errors.push("Name cannot exceed 60 characters");
    }

    if (!isOptionalString(body.phone)) {
        errors.push("Phone must be a string");
    }

    if (
        isOptionalString(body.phone) &&
        body.phone !== undefined &&
        body.phone.trim().length > 20
    ) {
        errors.push("Phone cannot exceed 20 characters");
    }

    if (!isOptionalImageObject(body.avatar)) {
        errors.push("Avatar must be an object with optional url and publicId");
    }

    return errors;
}

function validateChangePassword(body) {
    const errors = [];
    const bodyKeys = Object.keys(body);

    bodyKeys.forEach((key) => {
        if (!allowedPasswordChangeFields.includes(key)) {
            errors.push(`${key} is not an allowed password change field`);
        }
    });

    if (!isNonEmptyString(body.currentPassword)) {
        errors.push("Current password is required");
    }

    if (!isNonEmptyString(body.newPassword)) {
        errors.push("New password is required");
    }

    if (isNonEmptyString(body.newPassword) && body.newPassword.length < 8) {
        errors.push("New password must be at least 8 characters");
    }

    if (!isNonEmptyString(body.confirmPassword)) {
        errors.push("Confirm password is required");
    }

    if (
        isNonEmptyString(body.newPassword) &&
        isNonEmptyString(body.confirmPassword) &&
        body.newPassword !== body.confirmPassword
    ) {
        errors.push("New password and confirm password do not match");
    }

    if (
        isNonEmptyString(body.currentPassword) &&
        isNonEmptyString(body.newPassword) &&
        body.currentPassword === body.newPassword
    ) {
        errors.push("New password must be different from current password");
    }

    return errors;
}

export {
    validateUpdateProfile,
    validateChangePassword
};