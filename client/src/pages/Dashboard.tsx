import React, { useEffect } from 'react';
import axios from 'axios';
import { getTokenFromCookie } from '../utils/jwt';
import { ButtonType } from '../interfaces/IButton';
import Table from '../components/Table';
import Aside from '../components/Aside';
import { MAP_ALL_MAPS, MAP_DETAIL, MAP_NEW, MAP_USER_MAPS } from '../api/endpoints';

const dummyData = [
  {
      id: 1,
      createdAt: new Date().toLocaleDateString(),
      label: "Everest",
  },
  {
      id: 2,
      createdAt: new Date().toLocaleDateString(),
      label: "Mont Blank",
  },
  {
      id: 3,
      createdAt: new Date().toLocaleDateString(),
      label: "Springfield",
  },
  {
      id: 4,
      createdAt: new Date().toLocaleDateString(),
      label: "Ternopil",
  },
];

const dummyConfig = {
  heading: "",
  colgroup: [30, 25, 15, 15, 15],
  newItemRoute: "/admin/maps/new",
  newItemRouteLabel: "new map",
  thead: ["Label", "Created at", "View", "Edit", "Delete"],
  tbody: ["label", "createdAt"],
  buttons: [
    {
      type: ButtonType.REDIRECT,
      label: "View",
      actionUrlConstantPart: "/maps/map/",
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.REDIRECT,
      label: "Edit",
      actionUrlConstantPart: "/maps/map/",
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.DELETE,
      label: "Delete",
      actionUrlConstantPart: "/maps/map/",
      actionUrlDynamicPartKey: "id",
    }
  ]
}

const dummyMap = {
	center: {
		lat: 45.83256987294795,
		lng: 6.865163189418157,
		alt: 4791.7,
	},
	bbox: {
		northEast: {
      	lat: 45.9179008,
        lng: 6.9354122
    },
		southWest: {
        lat: 45.7724925,
      	lng: 6.7421217,
    },
	},
	zoom: 13,
	trailGpxUrl: "./assets/export2.gpx",
}

const Dashboard = () => {

  useEffect(() => {
    console.log("running")
    let token = getTokenFromCookie()
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
    //axios.post(MAP_NEW, {name: "My new map", mapModel:dummyMap}, config)
    //.then(res => console.log(res))
    //.catch(err => console.error(err))

    //axios.get(MAP_USER_MAPS, config)
    //.then(res => console.log(res))
    //.catch(err => console.error(err))

    //axios.get(MAP_ALL_MAPS, config)
    //.then(res => console.log(res))
    //.catch(err => console.error(err))

    //id mapy: 399b3e2ef44d4c8c95f553031ed48b49
    axios.get(MAP_DETAIL + "399b3e2ef44d4c8c95f553031ed48b49", config)
    .then(res => console.log(res))
    .catch(err => console.error(err))
  }, [])

  return (
    <section className="page-section mt-[8rem]">
        <div className="page-section__container">
            <h1 className="text-center mb-[6rem]">Your maps</h1>
            <div className="flex flex-col xl:flex-row">
              <Aside role="admin" />
              <Table config={dummyConfig} data={dummyData} />
            </div>
        </div>
    </section>
  )
}

export default Dashboard