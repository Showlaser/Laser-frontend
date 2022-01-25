import { useEffect } from "react";
import { createGuid } from "services/shared/math";
import "./index.css";

export default function TimeLineChannel(props) {
  const data = props?.data;

  useEffect(() => [props]);

  return (
    <div className="timeline-channel">
      <div className="timeline-identifier">
        <p>{data?.index}:</p>
      </div>
      <div className="timeline-content">
        {data?.items?.map((item) => (
          <span
            key={createGuid()}
            onClick={() => props.onTimelineChannelItemClick(item.uuid)}
            className="timeline-channel-item"
          >
            {item.settings.name}
          </span>
        ))}
      </div>
    </div>
  );
}