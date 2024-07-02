"use client";

import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
  Pin,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import { Meetup } from "@prisma/client";
import { Calendar } from "@/components/ui/icons";

const GoogleMap = ({
  meetup,
  meetupStartDate,
  meetupStartTime,
}: {
  meetup: Meetup;
  meetupStartDate: string;
  meetupStartTime: string;
}) => {
  const { title, address, latitude, longitude } = meetup;
  const lat = latitude ?? 40.68;
  const lng = longitude ?? -73.98;

  const { theme } = useTheme();
  const darkLightMode =
    theme === "dark" ? "7a9e2ebecd32a903" : "3fec513989decfcd";

  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState({ lat, lng });

  useEffect(() => {
    if (!infoWindowOpen) setCenter({ lat, lng });
  }, [infoWindowOpen, lat, lng, setCenter]);

  const zoomInOrOut = (zoomType: "in" | "out") => {
    setCenter({ lat, lng });
    setInfoWindowOpen(false);

    zoomType === "in" ? setZoom(zoom + 1) : setZoom(zoom - 1);
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAPSKEY!}>
      <Map
        style={{
          width: "100%",
          height: "100%",
        }}
        defaultCenter={{ lat, lng }}
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
            >
              +
            </button>
            <button
              className="googleMapZoomButton"
              onClick={() => zoomInOrOut("out")}
            >
              -
            </button>
          </div>
        </MapControl>
        <AdvancedMarker
          ref={markerRef}
          onClick={() => setInfoWindowOpen(true)}
          position={{ lat, lng }}
          title={title}
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
                <p className="paragraph-4-medium">{title}</p>
                <p>{address}</p>
                <p className="caption-10 text-dark-800 dark:text-white-300">
                  {meetupStartDate} @ {meetupStartTime}
                </p>
              </div>
            </InfoWindow>
          )}
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
};

export default GoogleMap;
