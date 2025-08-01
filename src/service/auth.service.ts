import { apiConfig } from '@api/config'
import { ApiUrls } from '@api/api-urls'
import { type SignIn } from '@types'
export const authService = {
    async signIn(model: SignIn, role: string):Promise<any>{
        const res = await apiConfig().postRequest(`/${role}-auth${ApiUrls.AUTH}` , model)
        return res
    },

 async sendForgetPasswordOtp(data: { email: string; role: string }) { {
  const response = await apiConfig().postRequest('https://erp-edu.uz/api/admin/forget-password', data);
  console.log('Forget password response:', response);
  return response?.data; 
}
},

async verifyForgetPasswordOtp(otp: number) {
  const response = await apiConfig().postRequest(`admin${ApiUrls.VERIFY_OTP}/`, {otp});
  console.log('Verify OTP response:', response);
  return response?.data; 
}
}