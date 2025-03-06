import { Post, Get } from "services/shared/api/api-actions";
import { sendRequest } from "services/shared/api/api-middleware";
import apiEndpoints from "services/shared/api/api-endpoints";

export const startVote = async (voteData: any) => {
  return sendRequest(() => Post(apiEndpoints.vote, voteData), []).then((value: any) => value.json());
};

export const getVoteData = async (codes: any) => {
  return sendRequest(
    () => Get(`${apiEndpoints.vote}?joinCode=${codes.joinCode}&accessCode=${codes.accessCode}`),
    [404]
  );
};
