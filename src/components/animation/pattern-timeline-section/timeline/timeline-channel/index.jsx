import { useEffect } from "react";
import "./index.css";

export default function TimeLineChannel(props) {
  const data = props?.data;

  useEffect(() => {}, [props]);

  return (
    <div className="timeline-channel">
      <div className="timeline-identifier">
        <p>{data?.index}:</p>
      </div>
      <div className="timeline-content">
        {data?.items?.map((item) => (
          <span
            onClick={() => props.onTimelineChannelItemClick(item.pattern)}
            className="timeline-channel-item"
          >
            {item.pattern.name}
          </span>
        ))}
      </div>
    </div>
  );
}
