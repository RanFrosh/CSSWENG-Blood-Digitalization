export interface DonorRegistrationRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  zipCode: string;
  email: string;
  mobileNumber: string;
  sex: string;
  bloodType: string;
}

export interface DonorRegistrationResponse {
  success: boolean;
  error?: string;
  donor?: {
    id: string;
    created_at: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    mobile_no: string;
    street: string;
    zip_code: string;
    sex: string;
    blood: string;
    city_id: string;
    photo_path: string;
    height: number | null;
    weight: number | null;
    active: boolean;
  };
}