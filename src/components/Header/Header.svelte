<script>
import Navbar from "$components/Navbar";

</script>
<header>
  <h1><a href="/">Road Trip</a></h1>
  <Navbar />
</header>

<style>
  h1 a {
    color: inherit;
  }
  h1 a:hover {
    text-decoration: none;
  }
  header {
    display: flex;
    align-content: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    top: 0;
    padding: 0 2rem;
    width: 100%;
    text-align: center;
    background-color: #ce97b0;
  }

</style>