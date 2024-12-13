import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify';
import { url } from '../App';

const AddSong = () => {

  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album,setAlbum]  = useState("none");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!song || !name) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('audio', song);
      formData.append('album', album);

      console.log('Sending data:', {
        name,
        desc,
        album,
        image: image?.name,
        audio: song?.name
      });

      const res = await axios.post(`${url}/api/song/add`, formData);

      console.log('Server response:', res.data);

      if (res.data.success) {
        toast.success(res.data.message || "Song added successfully");
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(false);
        setSong(false);
      } else {
        toast.error(res.data.message || "Failed to add song");
      }
    } catch (error) {
      console.error('Error details:', error);
      console.error('Response:', error.response?.data);
      toast.error(error.response?.data?.message || "Error occurred while adding song");
    }
    setLoading(false);
  }

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 tetx-grey-600'>
      <div className='flex gap-8'>
        <div className='flex flex-col gap-4'>
          <p>Upload song</p>
          <input onChange={(e)=>setSong(e.target.files[0])} type="file" id='song' accept='audio/*' hidden />
          <label htmlFor="song">
            <img src={song ? assets.upload_added : assets.upload_song} className='w-24 cursor-pointer' alt="" />
          </label>
        </div>
        <div className='flex flex-col gap-4'>
          <p>Upload image</p>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} className='w-24 cursor-pointer' alt="" />
          </label>
        </div>
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Song name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='bg-tranparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' type="text" name="" id="" required/>
      </div>
      <div className='flex flex-col gap-2.5'>
        <p>Song desciption</p>
        <input onChange={(e)=>setDesc(e.target.value)} value={desc} className='bg-tranparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' type="text" name="" id="" required/>
      </div>
      <div className='flex flex-col gap-2.5'>
      <p>Album</p>
      <select onChange={(e)=>setAlbum(e.target.value)} defaultValue={album} className='bg-tranparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' name="" id="">
        <option value="none">None</option>
      </select>
      </div>

      <button type="submit" className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>Add</button>
    </form>
  )
}

export default AddSong