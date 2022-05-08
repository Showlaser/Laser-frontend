import * as React from "react";
import { showError, toastSubject } from "services/shared/toast-messages";
import { range } from "d3-array";
import "./index.css";
const flattenSVG = require("flatten-svg");

export default function SvgToCoordinatesConverter() {
  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];
    if (file.type !== "image/svg+xml") {
      showError(toastSubject.invalidFile);
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const result = reader.result;
      setNewSvg(result);
    };

    reader.readAsText(file);
  };

  const setNewSvg = (rawSvg: any) => {
    const pathsOnly = pathologize(rawSvg);
    let newDiv = document.createElement("div");
    newDiv.innerHTML = pathsOnly;

    let paths: any = newDiv?.getElementsByTagName("path");
    const coordinates = pathsToCoords(paths, 1, 1000, 20, 20);
  };

  const pathologize = (original: any) => {
    //handles issues with pathologist not parsing text and style elements
    const reText = /<text[\s\S]*?<\/text>/g;
    const reStyle = /<style[\s\S]*?<\/style>/g;
    const removedText = original.replace(reText, "");
    const removedStyle = removedText.replace(reStyle, "");

    try {
      return flattenSVG(removedStyle);
    } catch (e) {
      return original;
    }
  };

  const pathsToCoords = (
    paths: any,
    scale: number,
    numPoints: any,
    translateX: number,
    translateY: number
  ) => {
    const totalLengthAllPaths: any = getTotalLengthAllPaths(paths);

    let runningPointsTotal = 0;
    return Array.from(paths).reduce((prev: any, item: any, index) => {
      let pointsForPath;
      if (index + 1 === paths.length) {
        //ensures that the total number of points = the actual requested number (because using rounding)
        pointsForPath = numPoints - runningPointsTotal;
      } else {
        pointsForPath = Math.round(
          (numPoints * item.getTotalLength()) / totalLengthAllPaths
        );
        runningPointsTotal += pointsForPath;
      }
      return [
        ...prev,
        ...polygonize(item, pointsForPath, scale, translateX, translateY),
      ];
    }, []);
  };

  function polygonize(
    path: any,
    numPoints: any,
    scale: number,
    translateX: number,
    translateY: number
  ) {
    //Thank you Noah!! http://bl.ocks.org/veltman/fc96dddae1711b3d756e0a13e7f09f24

    const length = path.getTotalLength();

    return range(numPoints).map(function (i: any) {
      const point = path.getPointAtLength((length * i) / numPoints);
      return [point.x * scale + translateX, point.y * scale + translateY];
    });
  }

  const scaleNewSVG = (
    flatCoords: any,
    paths: HTMLCollection,
    translateX: number,
    translateY: number
  ) => {
    const xMax = getCoordsMax(flatCoords, 0);
    const guessAtNewScale = Math.ceil(600 / xMax);
    const scaledLengthAllPaths =
      getTotalLengthAllPaths(paths) * guessAtNewScale;

    const guessAtNumPoints = Math.round(scaledLengthAllPaths / 10);
    const newFlatCoords = pathsToCoords(
      paths,
      guessAtNewScale,
      guessAtNumPoints,
      translateX,
      translateY
    );
    this.set({ scale: guessAtNewScale, numPoints: guessAtNumPoints });
    this.set({ newSVG: false });
    return newFlatCoords;
  };

  const getTotalLengthAllPaths = (paths: HTMLCollection) => {
    return Array.from(paths).reduce((prev: any, curr: any) => {
      return prev + curr.getTotalLength();
    }, 0);
  };

  const getCoordsMax = (coords: any, index: any) => {
    return coords
      .map((x: { [x: string]: any }) => {
        return x[index];
      })
      .reduce(function (a: number, b: number) {
        return Math.max(a, b);
      });
  };

  return (
    <div>
      <div id="svg-data"></div>
      <input type="file" onChange={onFileUpload} />
    </div>
  );
}
