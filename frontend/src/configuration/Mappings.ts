import { PointOfServiceType } from "@/enums/PointOfServiceType"

export type PointOfServiceTypeIconMappingType = {
	[key in PointOfServiceType]: string
}

export const PointOfServiceTypeIconMapping: PointOfServiceTypeIconMappingType = {
	NEED_HELP: "🆘",
	LOOKING_FOR: "👀",
	SELLING: "💲",
	GIVE_AWAY: "💲"
}
