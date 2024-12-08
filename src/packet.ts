import { Reader, Writer } from "./buffer.ts";
import { SignIn } from "./packets/sign_in.ts";
import { Services } from "./service.ts";

export interface Packet {
  serialize(writer: Writer): void;
  deserialize(reader: Reader): void;
  handle(services: Services, id: number): void;
}

export * from "./packets/sign_in.ts";
export * from "./packets/sign_up.ts";

export enum PacketId {
  None,
  Login,
  FailLogin,
  CreateAccount,
  CreateActor,
  FailCreateActor,
  Actor,
  RemoveActor,
  UseActor,
  Motd,
  PlayerData,
  RemovePlayer,
  PlayerMove,
  MapMsg,
  ChatMsg,
  AlertMsg,
  PlayerAttack,
  AttackPlayer,
  AttackEnemy,
  UseItem,
  UseSkill,
  Animation,
  Balloon,
  UseHotBar,
  EnemyRevive,
  EventData,
  EventMove,
  AddDrop,
  RemoveDrop,
  AddProjectile,
  PlayerVitals,
  PlayerExp,
  PlayerState,
  PlayerBuff,
  PlayerItem,
  PlayerGold,
  PlayerParam,
  PlayerEquip,
  PlayerSkill,
  PlayerClass,
  PlayerSex,
  PlayerGraphic,
  PlayerPoints,
  PlayerHotBar,
  Target,
  Transfer,
  OpenFriends,
  AddFriend,
  RemoveFriend,
  OpenCreateGuild,
  CreateGuild,
  OpenGuild,
  GuildName,
  GuildLeader,
  GuildNotice,
  RemoveGuildMember,
  GuildRequest,
  LeaveGuild,
  JoinParty,
  LeaveParty,
  DissolveParty,
  Choice,
  OpenBank,
  BankItem,
  BankGold,
  CloseWindow,
  OpenShop,
  BuyItem,
  SellItem,
  OpenTeleport,
  ChoiceTeleport,
  EventCommand,
  NextCommand,
  Request,
  AcceptRequest,
  DeclineRequest,
  TradeItem,
  TradeGold,
  AddQuest,
  FinishQuest,
  VipDays,
  Logout,
  AdminCommand,
  Switch,
  Variable,
  SelfSwitch,
  NetSwitch,
}

export const Packets: Record<number, () => Packet> = {
  [PacketId.Login]: () => new SignIn(),
};
