// import { useForgetPassword } from "@hooks";

export const ForgetPassword = () => {
  return (
    <div>
      <h1>Forget Password Page</h1>
      <p>This is the forget password page.</p>
      <form action="/forget-password" method="POST">
      <input type="email" name="email" />
      <select name="role" >
        <option value="teacher">O‘qituvchi</option>
        {/* <option value="student">Talaba</option> */}
        <option value="admin">Admin</option>
        {/* <option value="lid">Lid</option> */}
      </select>
        <button type="submit">Yuborish</button>

      </form>
    </div>
  );
};

export default ForgetPassword;