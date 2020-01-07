import main from '../src/main';
import canBeApproved from '../src/utils/canBeApproved';
import loadBotConfig from '../src/utils/loadBotConfig';
import { approvePR, getLatestApprovalFromBot, dismissPRApproval } from '../src/utils/githubApi';
import messages from '../src/config/messages.json';

jest.mock('../src/utils/canBeApproved');
jest.mock('../src/utils/loadBotConfig');
jest.mock('../src/utils/githubApi');

(loadBotConfig as jest.Mock).mockReturnValue({
  botsGithubName: 'pr-review-bot-omio',
  authorizationToken: 'token',
  botConfigFileNames: ['.pr-bot.json'],
});

const mockBotOptions = {
  GIT_COMMIT: 'GIT_COMMIT',
  GIT_REPO: 'GIT_REPO',
  PR_ID: 'PR_ID',
  GITHUB_TOKEN: 'GITHUB_TOKEN',
};

const consoleMock = {
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
};

beforeEach(() => {
  [approvePR, dismissPRApproval, consoleMock.info, consoleMock.debug, consoleMock.error].forEach(fn => (fn as jest.Mock).mockClear());
});

describe('main process', () => {
  it('should approve the PR', async () => {
    (canBeApproved as jest.Mock).mockResolvedValue(true);
    (getLatestApprovalFromBot as jest.Mock).mockResolvedValue(null);

    await main(mockBotOptions, consoleMock);

    expect(consoleMock.info).toHaveBeenCalledWith(messages.SUCCESSFULLY_APPROVED);
    expect(approvePR).toHaveBeenCalled();
  });

  it('should not approve again if already approved', async () => {
    (canBeApproved as jest.Mock).mockResolvedValue(true);
    (getLatestApprovalFromBot as jest.Mock).mockResolvedValue(123);

    await main(mockBotOptions, consoleMock);

    expect(consoleMock.info).toHaveBeenCalledWith(messages.ALREADY_APPROVED);
    expect(approvePR).not.toHaveBeenCalled();
  });

  it('should not approve the PR', async () => {
    (canBeApproved as jest.Mock).mockResolvedValue(false);
    (getLatestApprovalFromBot as jest.Mock).mockResolvedValue(null);

    await main(mockBotOptions, consoleMock);

    expect(consoleMock.info).toHaveBeenCalledWith(messages.NOT_ELIGIBLE);
    expect(approvePR).not.toHaveBeenCalled();
  });

  it('should dismiss the approval', async () => {
    (canBeApproved as jest.Mock).mockResolvedValue(false);
    (getLatestApprovalFromBot as jest.Mock).mockResolvedValue(123);

    await main(mockBotOptions, consoleMock);

    expect(consoleMock.info).toHaveBeenCalledWith(messages.APPROVAL_DISMISSED);
    expect(dismissPRApproval).toHaveBeenCalledWith(mockBotOptions, 123);
  });
});
