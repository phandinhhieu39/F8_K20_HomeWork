import { Link } from "react-router";

export default function NotFoundPage() {
    return (
        <div>
            <div>404 Not Found</div>
            <Link to="/">Go Back Home</Link>
        </div>
    );
}
