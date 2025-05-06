import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import {
  genreOptions,
  keyOptions,
} from "../../../../src/assets/js/constantDatas"; // Assuming you have a file with genres
import { fetchSingers } from "../../../assets/util/api";

const AddLyric = ({ onClose, onUpdate, showNewMessage }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.height = "auto";
    };
  }, []);

  const [title, setTitle] = useState();
  const [albumnName, setAlbumnName] = useState();

  const token = localStorage.getItem("token");

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMajorKey, setSelectedMajorKey] = useState(null);

  const addLyric = async () => {
    const response = await fetch(
      `http://localhost:3000/api/artists/createArtist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: title,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      showNewMessage("error", errorData.errors[0].message);
      throw new Error(errorData.errors[0].message);
    } else {
      showNewMessage("success", `${name} added successfully`);
    }
    const data = await response.json();
    return data;
  };

  const [singers, setSingers] = useState([]);
const [selectedSingers, setSelectedSingers] = useState([]);

const [writers, setWriters] = useState([]);
const [selectedWriters, setSelectedWriters] = useState([]);

const [features, setFeatures] = useState([]);
const [selectedFeatures, setSelectedFeatures] = useState([]);

useEffect(() => {
  const getArtists = async () => {
    try {
      const [singerData, writerData] = await Promise.all([
        fetchSingers("singer"),
        fetchSingers("writer"),
      ]);

      setSingers(singerData);
      setWriters(writerData);

      const combined = [...singerData, ...writerData];
      const deduped = Array.from(
        new Map(combined.map((item) => [item._id, item])).values()
      );
      setFeatures(deduped);
      console.log("Deduped features:", deduped);
    } catch (err) {
      console.error("Error fetching artists:", err);
    }
  };

  getArtists();
}, []);

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-center items-center">
        <div className="absolute inset-0 bg-[#00000050]" onClick={onClose} />
        <div className="bg-white p-6 rounded-lg shadow-lg relative z-[101] w-[600px]">
          <h2 className="text-xl font-bold flex items-center justify-between">
            Add New Lyric
          </h2>

          <div className="flex flex-col mt-2">
            <div className="row">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                className="w-full p-2 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lyric title"
              />
            </div>

            <div className="row">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Album Name
              </label>
              <input
                type="text"
                value={albumnName}
                className="w-full p-2 py-2 border border-gray-300 rounded-md"
                onChange={(e) => setAlbumnName(e.target.value)}
                placeholder="Enter lyric title"
              />
            </div>

            <div className="row flex gap-4">
              <div className="col w-full">
                <label className="block my-2 text-sm font-medium text-gray-700">
                  Genres
                </label>
                <MultiSelect
                  value={selectedGenres}
                  onChange={(e) => setSelectedGenres(e.value)}
                  options={genreOptions}
                  optionLabel="name"
                  placeholder="Select Genres"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                />
              </div>
              <div className="col w-full">
                <label className="block my-2 text-sm font-medium text-gray-700">
                  Key
                </label>
                <Dropdown
                  value={selectedMajorKey}
                  onChange={(e) => setSelectedMajorKey(e.value)}
                  options={keyOptions}
                  optionLabel="name"
                  placeholder="Select a Major Key"
                  className="w-full md:w-20rem"
                />
              </div>
            </div>

            <div className="row gap-4">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Singers
              </label>
              <MultiSelect
                value={selectedSingers}
                onChange={(e) => setSelectedSingers(e.value)}
                options={singers}
                optionLabel="name"
                placeholder="Select Singers"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                filter
                filterPlaceholder="Search Singers..."
              />
            </div>

            <div className="row gap-4">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Writers
              </label>
              <MultiSelect
                value={selectedWriters}
                onChange={(e) => setSelectedWriters(e.value)}
                options={writers}
                optionLabel="name"
                placeholder="Select Writers"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                filter
                filterPlaceholder="Search Writers..."
              />
            </div>

            <div className="row gap-4">
              <label className="block my-2 text-sm font-medium text-gray-700">
                Features
              </label>
              <MultiSelect
                value={selectedFeatures}
                onChange={(e) => setSelectedFeatures(e.value)}
                options={features}
                optionLabel="name"
                placeholder="Select Features"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
                filter
                filterPlaceholder="Search Features..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                await addLyric();
                onUpdate();
                onClose();
              }}
              className="w-full cursor-pointer mt-4 bg-green-200 text-green-700 font-semibold px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-full cursor-pointer mt-4 bg-gray-200 text-gray-500 font-semibold px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

AddLyric.propTypes = {
  onClose: PropTypes.func.isRequired,
  artist: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showNewMessage: PropTypes.func.isRequired,
};

export default AddLyric;
