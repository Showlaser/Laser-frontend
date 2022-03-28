import { Post, Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-urls";

export const startVote = (voteData) => {
  return sendRequest(() => Post(apiEndpoints.vote, voteData), []).then(
    (value) => value.json()
  );
};

export const getVoteData = async (codes) => {
  return sendRequest(
    () =>
      Get(
        `${apiEndpoints.vote}?joinCode=${codes.joinCode}&accessCode=${codes.accessCode}`
      ),
    [404]
  );
};
