
 import { Link } from "react-router-dom";
 
 function Home() {
  return (
    <main>
      <section className="hero">
        <h1>The Great Split</h1>

        <h2>Split Expenses. Not Friendships.</h2>

        <p>
          Easily split bills, track expenses, and settle balances
          with your friends.
        </p>

        <div className="hero-buttons">
          <Link to="/create-group"> <button> Create a Group </button> </Link>
          <Link to="/dashboard"><button>View Dashboard </button></Link>
        </div>
      </section>
    </main>
  );
}

export default Home;