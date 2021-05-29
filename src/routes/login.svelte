<script lang="ts">
  import { Auth } from "$api/methods";
  let email = '';
  let password = '';
  const onSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> = (e) => {
    Auth.login({ email, password }).then(res => console.log(res));
  }
</script>

<h2>Login</h2>
<form on:submit|preventDefault={onSubmit}>
  <div>
    <label for="email">Email</label>
    <input type="email" name="email" bind:value={email} />
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" name="password" bind:value={password} />
  </div>
  <button type="submit">Login</button>
</form>