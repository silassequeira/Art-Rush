// Filters.jsx
import InteractionService from "../services/interactionService";
import { useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import PropTypes from "prop-types";
import SelectFilter from "./SelectFilter";
import SearchFilter from "./SearchFilter";

function Filters({
  userId,
  onNationalityChange,
  onMediumChange,
  onArtistChange,
}) {
  const [nationalities, setNationalities] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNationality, setSelectedNationality] = useState("");
  const [selectedMedium, setSelectedMedium] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        console.log(`Fetching nationalities for userId: ${userId}`);
        const data = await InteractionService.savedNationalities(userId);
        console.log("Fetched nationalities:", data.nationalities);
        setNationalities(data.nationalities || []);
      } catch (error) {
        console.error("Error fetching nationalities:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMediums = async () => {
      try {
        console.log(`Fetching mediums for userId: ${userId}`);
        const data = await InteractionService.savedMediums(userId);
        console.log("Fetched mediums:", data.mediums);
        setMediums(data.mediums || []);
      } catch (error) {
        console.error("Error fetching nationalities:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchArtists = async () => {
      try {
        console.log(`Fetching artists for userId: ${userId}`);
        const data = await InteractionService.savedArtists(userId);
        console.log("Fetched artists:", data.artists);
        setArtists(data.artists || []);
      } catch (error) {
        console.error("Error fetching Artists:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
    fetchMediums();
    fetchNationalities();
  }, [userId]);

  const handleSelectChange = (newNationality) => {
    setSelectedNationality(newNationality);
    onNationalityChange(newNationality);
  };

  const handleMediumChange = (newMedium) => {
    setSelectedMedium(newMedium);
    onMediumChange(newMedium);
  };

  const handleArtistsChange = (newArtists) => {
    setSelectedArtist(newArtists);
    onArtistChange(newArtists);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Add "All Nationalities" to the options array
  const allOptions = ["All Nationalities", ...nationalities];
  const allOptionsMedium = ["All Mediums", ...mediums];

  return (
    <>
      <div className="flexWrap fullWidth marginTop">
        <div className="flex widthFitContent">
          <SelectFilter
            options={allOptions}
            value={selectedNationality || "All Nationalities"}
            onChange={(selected) => {
              // If "All Nationalities" is selected, pass empty string to maintain original logic
              handleSelectChange(
                selected === "All Nationalities" ? "" : selected
              );
            }}
          />
          <SelectFilter
            options={allOptionsMedium}
            value={selectedMedium || "All Mediums"}
            onChange={(selected) => {
              // If "All Nationalities" is selected, pass empty string to maintain original logic
              handleMediumChange(selected === "All Mediums" ? "" : selected);
            }}
          />
        </div>

        <div className="flex widthFitContent marginTop">
          <SearchFilter
            options={["All Artists", ...artists]}
            value={selectedArtist || "All Artists"}
            onChange={(selected) => {
              handleArtistsChange(selected === "All Artists" ? "" : selected);
            }}
          />
        </div>
      </div>
    </>
  );
}

Filters.propTypes = {
  userId: PropTypes.string.isRequired,
  onNationalityChange: PropTypes.func.isRequired,
  onMediumChange: PropTypes.func.isRequired,
  onArtistChange: PropTypes.func.isRequired,
};

export default Filters;
