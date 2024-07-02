"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Map,
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
  Pin,
  MapControl,
  ControlPosition,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { Calendar } from "@/components/ui/icons";
import { IMeetupSchema } from "@/lib/validations/meetup.validations";

const GoogleMapAutocomplete = ({
  onChange,
  formState,
}: {
  onChange: ({
    address,
    lat,
    lng,
  }: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  formState: IMeetupSchema;
}) => {
  const {
    title,
    location: { address: loc, lat, lng },
    startTime,
  } = formState;

  const meetupStartDate = startTime
    ? format(new Date(startTime), "EEEE, MMMM dd, yyyy")
    : format(new Date(), "EEEE, MMMM dd, yyyy");
  const meetupStartTime = startTime
    ? format(new Date(startTime), "p")
    : format(new Date(), "p");

  const { theme } = useTheme();
  const darkLightMode =
    theme === "dark" ? "7a9e2ebecd32a903" : "3fec513989decfcd";

  const map = useMap();
  const places = useMapsLibrary("places");

  const inputRef = useRef<HTMLInputElement>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState({ lat, lng });
  const [coordinates, setCoordinates] = useState({ lat, lng });
  const [address, setAddress] = useState(loc ?? "");

  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  useEffect(() => {
    onChange({
      address: address as string,
      lat: coordinates.lat,
      lng: coordinates.lng,
    });
  }, [address, coordinates, onChange]);

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places, center, zoom, address]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      setSelectedPlace(placeAutocomplete.getPlace());
    });
  }, [setSelectedPlace, placeAutocomplete]);

  useEffect(() => {
    if (!map || !selectedPlace) return;

    if (selectedPlace.geometry?.viewport) {
      map.fitBounds(selectedPlace.geometry?.viewport);
      setCoordinates({
        lat: selectedPlace.geometry?.location?.lat() as number,
        lng: selectedPlace.geometry?.location?.lng() as number,
      });
      setAddress(selectedPlace.formatted_address as string);
    }
  }, [map, selectedPlace]);

  useEffect(() => {
    if (!infoWindowOpen)
      setCenter({ lat: coordinates.lat, lng: coordinates.lng });
  }, [infoWindowOpen, coordinates.lat, setCenter, coordinates.lng]);

  const zoomInOrOut = (zoomType: "in" | "out") => {
    setCenter({ lat: coordinates.lat, lng: coordinates.lng });
    setInfoWindowOpen(false);

    zoomType === "in" ? setZoom(zoom + 1) : setZoom(zoom - 1);
  };

  return (
    <Map
      style={{
        width: "100%",
        height: "100%",
      }}
      defaultCenter={{ lat: coordinates.lat, lng: coordinates.lng }}
      center={center}
      onCenterChanged={(e) => setCenter(e.detail.center)}
      defaultZoom={zoom}
      zoom={zoom}
      gestureHandling={"none"}
      mapId={darkLightMode}
      mapTypeId={"roadmap"}
      disableDefaultUI={true}
      backgroundColor={"dark-800"}
    >
      <MapControl position={ControlPosition.RIGHT_BOTTOM}>
        <div className="mb-1 mr-2 flex flex-col gap-y-1">
          <button
            className="googleMapZoomButton"
            onClick={() => zoomInOrOut("in")}
            type="button"
          >
            +
          </button>
          <button
            className="googleMapZoomButton"
            onClick={() => zoomInOrOut("out")}
            type="button"
          >
            -
          </button>
        </div>
      </MapControl>

      <MapControl position={ControlPosition.TOP_LEFT}>
        <div className="m-4 flex w-full">
          <input
            ref={inputRef}
            id="map-search"
            className="paragraph-3-regular min-w-[275px] rounded  border border-white-border bg-white-100 p-1.5 text-dark-700 placeholder:text-white-400 dark:border-dark-border dark:bg-dark-800 dark:text-white-100"
            placeholder="Enter a meetup address"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                document.activeElement?.id === "map-search"
              )
                e.preventDefault();
            }}
          />
        </div>
      </MapControl>

      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfoWindowOpen(true)}
        position={{ lat: coordinates.lat, lng: coordinates.lng }}
        title={title ?? ""}
      >
        <Pin background={"#825EF6"} borderColor={"#825EF6"} scale={1.2}>
          <Calendar size={16} fill="fill-white-200" />
        </Pin>
        {infoWindowOpen && (
          <InfoWindow
            anchor={marker}
            maxWidth={200}
            onCloseClick={() => setInfoWindowOpen(false)}
          >
            <div className="paragraph-4-regular mt-1 flex w-full flex-col gap-y-2 text-dark-700 dark:bg-dark-700 dark:text-white-200">
              <p className="paragraph-4-medium">
                {title.length > 0 ? title : "New Meetup"}
              </p>
              <p>{address ?? selectedPlace?.formatted_address}</p>
              <p className="caption-10 text-dark-800 dark:text-white-300">
                {meetupStartDate} @ {meetupStartTime}
              </p>
            </div>
          </InfoWindow>
        )}
      </AdvancedMarker>
    </Map>
  );
};

export default GoogleMapAutocomplete;
