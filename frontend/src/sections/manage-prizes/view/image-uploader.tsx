import React from "react";

import { blue } from "@mui/material/colors";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Fab, Card, Grid, CardContent, CardActionArea } from "@mui/material";


const rootStyles = {
  bgColor: "background.paper",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItemes: "center"
}

const cardContainerStyles = {
  width: "100px",
  margin: "10px",
}

const cardRootStyles = {
  paddingBottom: "14px !important"
}

const cardRootHideStyles = {
  paddingBottom: "14px !important",
  margin: "-16px"
}

const inputStyles = {
  display: "none"
}

const buttonStyles = {
  color: blue[900],
  margin: 10
}

const logoStyles = {
  width: "100px",
  height: "100px"
}

const default_profile_pic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"

export default function ImagePicker(props: {setPic: React.Dispatch<React.SetStateAction<string>>}) {
  const [uploadState, setUploadState] = React.useState("initial");
  const [image, setImage] = React.useState(default_profile_pic);

  const handleUploadClick = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = function loaded() {
        postDetails(file)
      };
    }
  };

  const handleResetClick = () => {
    props.setPic(default_profile_pic);
    setImage(default_profile_pic);
    setUploadState("initial");
  };

  const postDetails = (pics: any): void => {
    if (
      pics ===
      default_profile_pic
    ) {
      props.setPic(default_profile_pic);
      setImage(default_profile_pic);
      setUploadState("initial")
      return;
    }
    props.setPic(default_profile_pic);
    setImage(default_profile_pic);
    setUploadState("initial");
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "runiverse");
      data.append("cloud_name", "gc-studios");
      fetch("https://api.cloudinary.com/v1_1/gc-studios/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((image_data: any) => {
          props.setPic(image_data.url.toString());
          setImage(image_data.url.toString());
          setUploadState("uploaded")
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      props.setPic(default_profile_pic);
      setImage(default_profile_pic);
      setUploadState("initial");
      return;
    }
  };

  return (
    <div style={rootStyles}>
      <Card style={cardContainerStyles}>
        <CardContent
          style={
            uploadState !== "uploaded" ? cardRootStyles : cardRootHideStyles
          }
        >
          <Grid container spacing={3}>
            <input
              accept="image/jpeg,image/png,image/tiff,image/webp"
              style={inputStyles}
              id="contained-button-file"
              name="logo"
              type="file"
              onChange={handleUploadClick}
            />
            <label
              htmlFor="contained-button-file"
              style={uploadState === "uploaded" ? inputStyles : {}}
            >
              <Fab component="span" style={buttonStyles}>
                <AddPhotoAlternateIcon />
              </Fab>
            </label>
          </Grid>
        </CardContent>
        {uploadState === "uploaded" && (
          <CardActionArea onClick={handleResetClick}>
            <img style={logoStyles} src={image} alt="LOGO" />
          </CardActionArea>
        )}
      </Card>
    </div>
  );
}