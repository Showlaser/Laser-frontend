export default function TimeLineChannel(props) {
  return (
    <div className="timeline-channel">
      <div className="timeline-identifier">
        <text>{props?.id}</text>
      </div>
      <div className="timeline-content"></div>
    </div>
  );
}
