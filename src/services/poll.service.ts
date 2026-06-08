import database from '../config/database.js'
import { Poll } from '../models/poll.model.js'
import { PollStatus, VoteType } from '../utils/enums.js'

export const pollService = database.appDataSource.getRepository(Poll).extend({
   findOpenPolls(){

    return this.createQueryBuilder('poll')
     .leftJoinAndSelect('poll.vote', 'vote')
     .leftJoinAndSelect('vote.user', 'user')
     .where('poll.status = :status', {
       status: PollStatus.OPEN,
     })
     .getMany();
   }
})

// const polls = await database.appDataSource
//   .getRepository(Poll)
//   .createQueryBuilder('Poll')
//   .leftJoin('poll.vote', 'vote')
//   .loadRelationCountAndMap(
//     'poll.votesFor',
//     'poll.vote',
//     'voteFor',
//     (qb) =>
//       qb.where('voteFor.vote = :type', {
//         type: VoteType.FAVOR,
//       }),
//   )
//   .loadRelationCountAndMap(
//     'poll.votesAgainst',
//     'poll.vote',
//     'voteAgainst',
//     (qb) =>
//       qb.where('voteAgainst.vote = :type', {
//         type: VoteType.AGAINST,
//       }),
//   )
//   .getMany()

const polls = await pollService
  