function TopBar() {
    return (
        <div className="bg-yellow-400 p-2 p-l-100 block justify-center items-center shadow-md">
            <header className="text-2xl font-bold text-white">
                <a href="#">Icon</a>
                <div>
                    <input type="text" placeholder="Search..." className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    <button className="ml-2 p-2 bg-white text-yellow-500 rounded-md hover:bg-yellow-100">Search</button>
                </div>
            </header>
            <header className="text-2xl font-bold text-white">
                <a href="#">Icon</a>
                <div>
                    <input type="text" placeholder="Search..." className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    <button className="ml-2 p-2 bg-white text-yellow-500 rounded-md hover:bg-yellow-100">Search</button>
                </div>
            </header>
        </div>
    )
};
export default TopBar;