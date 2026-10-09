import { Link } from "react-router-dom"
function Navbar() {
    return (

        <nav>
            <Link to="/">The Great Split</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/create-group">Create Group</Link>
        </nav>

    );
}
export default Navbar;