// Import necessary hooks and libraries
import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io";
import axios from "axios";

const Table = () => {
  
  const [data, setData] = useState([]); // State for storing data fetched from the API
  const [formData, setFormData] = useState({ // State for storing form data (country and gender filters)
    country: "",
    gender: "",
  });

  const [sortConfig, setSortConfig] = useState({  // State for managing sorting
    key: "id", // Default sort by 'id'
    direction: "ascending", // Default sort direction
  });

  const [currentPage, setCurrentPage] = useState(1);  // State for pagination
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {  // Effect hook to fetch data when the component mounts
    fetchData(currentPage);
  }, [currentPage]); // Fetch data when the currentPage changes

  // eslint-disable-next-line no-unused-vars
  const fetchData = () => {
    axios
      .get("https://dummyjson.com/users")
      .then((response) => {
        setData(response.data.users); // Store fetched data in state
        setTotalPages(Math.ceil(response.data.users.length / itemsPerPage)); // Calculate total pages
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error); // Log any errors
      });
  };

  const CountryMap = {  // Mapping for country names to abbreviations
    "United States": "USA", //country mapping
    India: "IND",
    "United Arab Emirates": "UAE",
    "United Kingdom": "UK",
  };

  const GenderMap = {  // Mapping for gender values
    male: "M",
    female: "F",
    other: "Other",
  };

  const filteredData = data.filter((user) => {  // Filter data based on form inputs (country and gender)
    return (
      (formData.country === "" ||
        CountryMap[user.address.country] === formData.country ||
        user.address.country === formData.country) &&
      (formData.gender === "" ||
        GenderMap[user.gender] === formData.gender ||
        user.gender === formData.gender)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => { // Sort data based on the sortConfig state
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const currentPageData = sortedData.slice(  // Get current page data
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {  // Handler for changing sort configuration
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {  // Handler for changing the page
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <div className="flex-grow">
          <p className="font-bold text-3xl">Employees</p>
        </div>
        {/* Filter section */}
        <FaFilter className="text-xl ml-2 mt-1 text-red-500" />{" "} {/* Filter icon */}
        {/* Country filter dropdown */}
        <div className="ml-2 w-full md:w-1/3">
          <select
            className="w-full border-2 border-gray-400 p-2 rounded-md"
            name="country"
            value={formData.country}
            onChange={(event) =>
              setFormData({ ...formData, country: event.target.value })
            }
          >
            <option value="">Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="UAE">UAE</option>
          </select>
        </div>
        {/* End Country filter dropdown */}
        {/* Gender filter dropdown */}
        <div className="ml-2 w-full md:w-1/3">
          <select
            className="w-full border-2 border-gray-400 p-2 rounded-md"
            name="gender"
            value={formData.gender}
            onChange={(event) =>
              setFormData({ ...formData, gender: event.target.value })
            }
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* End Gender filter dropdown */}
      </div>
      {/* End Filter section */}
      {/* Table section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th
                className="py-2 px-4 bg-gray-200 text-left cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "ascending" ? (
                    <IoIosArrowRoundUp className="ml-6 mb-4 -mt-4" />
                  ) : (
                    <IoIosArrowRoundDown className="ml-6 mb-4 -mt-5" />
                  ))}
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left">Image</th>
              <th
                className="py-2 px-4 bg-gray-200 text-left cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                Full Name
                {sortConfig.key === "fullName" &&
                  (sortConfig.direction === "ascending" ? (
                    <IoIosArrowRoundUp className="ml-20 mb-3 -mt-5" />
                  ) : (
                    <IoIosArrowRoundDown className="ml-20 mb-3 -mt-5" />
                  ))}
              </th>
              <th
                className="py-2 px-4 bg-gray-200 text-left cursor-pointer"
                onClick={() => handleSort("age")}
              >
                Demography (Age)
                {sortConfig.key === "age" &&
                  (sortConfig.direction === "ascending" ? (
                    <IoIosArrowRoundUp className="ml-36 mb-4 -mt-5" />
                  ) : (
                    <IoIosArrowRoundDown className="ml-36 mb-4 -mt-5" />
                  ))}
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left">Designation</th>
              <th className="py-2 px-4 bg-gray-200 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {/* Render current page data */}
            {currentPageData.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="py-2 px-4">{`${user.firstName} ${user.maidenName} ${user.lastName}`}</td>
                <td className="py-2 px-4">{`${GenderMap[user.gender]}/${
                  user.age
                }`}</td>
                <td className="py-2 px-4">{user.company.title}</td>
                <td className="py-2 px-4">{`${user.address.state}, ${
                  CountryMap[user.address.country] || user.address.country
                }`}</td>
              </tr>
            ))}
            {/* End Render current page data */}
          </tbody>
        </table>
      </div>
      {/* End Table section */}
      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-200 p-2 rounded-md"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="p-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="bg-gray-200 p-2 rounded-md"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {/* End Pagination controls */}
    </div>
  );
};

export default Table;
