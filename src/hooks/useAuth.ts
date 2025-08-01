import { useMutation } from "@tanstack/react-query";
import { authService } from "@service";
import { type SignIn } from "@types";
export const useAuth = () => {
    return useMutation({
        mutationFn: async ({ data, role }: { data: SignIn; role: string }) => authService.signIn(data, role),
    })

}


export const useForgetPassword = () => {
    return useMutation({
        mutationFn: async ({ email, role }: { email: string; role: string }) => authService.sendForgetPasswordOtp({email, role}),
    });
};


export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: async ( otp:any ) => authService.verifyForgetPasswordOtp(otp.otp!),
    });
};


