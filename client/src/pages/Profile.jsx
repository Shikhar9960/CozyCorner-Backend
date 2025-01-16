import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  console.log(token); // Check if it's being retrieved correctly


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  console.log(currentUser._id);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile");
    formData.append("cloud_name", "dls6dxtep");

    try {
      // Cloudinary API URL with your cloud name
      const response = await axios.post("https://api.cloudinary.com/v1_1/dls6dxtep/image/upload", formData);
      const data = response.data;

      if (data.secure_url) {
        // Successfully uploaded, store the image URL in formData
        setFormData({ ...formData, avatar: data.secure_url });
      } else {
        setFileUploadError(true);
      }
    } catch (error) {
      setFileUploadError(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(
        `/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(
        `/api/user/delete/${currentUser._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await axios.post('/api/auth/signout');

      if (!res.data.success) {
        throw new Error('Failed to sign out. Please try again.');
      }

      dispatch(deleteUserSuccess(res.data));
    } catch (error) {
      console.error('Signout Error:', error);
      dispatch(deleteUserFailure(error.message || 'Something went wrong'));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await axios.get(
        `/api/user/listings/${currentUser._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await axios.delete(`/api/listing/delete/${listingId}`);
      const data = res.data;
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-slate-500 text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar ? `${formData.avatar}?w=150&h=150&crop=fill` : currentUser.avatar}
          alt="profile"
          className="h-24 w-24 shadow-lg object-cover cursor-pointer self-center mt-2 outline-4"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image upload (image must be less than 2 mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-slate-500">Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-500 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className="bg-darkpink text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-900 cursor-pointer">
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-900 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-900 mt-5">{error ? error : ''}</p>
      <p className="text-slate-500 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>
      <button onClick={handleShowListings} className="text-slate-500 w-full">
        Show Listings
      </button>
      <p className="text-red-900 mt-5">{showListingsError ? 'Error showing listings' : ''}</p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-slate-500 mt-7 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className="border shadow-xl rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain" />
              </Link>
              <Link
                className="text-slate-500 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button onClick={() => handleListingDelete(listing._id)} className="text-red-900 uppercase">
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-slate-500 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
