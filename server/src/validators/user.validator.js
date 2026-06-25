import {
    isNonEmptyString,
    isOptionalImageObject,
    isOptionalString
} from "../utils/validators.js";

const allowedProfileUpdateFields = ["name", "phone", "avatar"];

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

export {
    validateUpdateProfile
};