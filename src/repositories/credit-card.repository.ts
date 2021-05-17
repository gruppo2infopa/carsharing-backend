import { EntityRepository, Repository } from 'typeorm';
import { CreditCard } from '../models/credit-card.model';

@EntityRepository(CreditCard)
export class CreditCardRepository extends Repository<CreditCard> {}
