import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loader = () => {
  return (
    <div className="m-3">
      <h1>
        <Skeleton
          style={{
            color: "#fff",
            width: "100%",
            height: "100px",
          }}
        />
      </h1>
      <p>
        <Skeleton
          className="custom-skeleton"
          count={1}
          style={{
            color: "#fff",
            width: "100%",
            height: "60px",
            marginTop: "30px",
          }}
        />
        <Skeleton
          className="custom-skeleton"
          style={{
            height: "40px",
            marginTop: "30px",
          }}
        />
        <Skeleton
          className="custom-skeleton"
          style={{
            height: "40px",
            marginTop: "10px",
          }}
        />
      </p>

      <div className="flex justify-center items-center">
        <Skeleton
          className="custom-skeleton"
          width={600}
          style={{
            height: "60px",
            marginTop: "20px",
            borderRadius: "50px",
          }}
        />
      </div>
      <Skeleton
        style={{
          height: "50px",
          marginTop: "30px",
        }}
      />
      <div className="flex flex-row gap-7 justify-center items-center mt-12 ">
        <Skeleton height={300} width={300} className="custom-skeleton" />
        <Skeleton height={300} width={300} className="custom-skeleton" />
        <Skeleton height={300} width={300} className="custom-skeleton" />
        <Skeleton height={300} width={300} className="custom-skeleton" />
      </div>
    </div>
  );
};

export default Loader;
