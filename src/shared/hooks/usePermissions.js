import {useDataEngine} from "@dhis2/app-runtime";
import {useState} from "react";

export const usePermissions = () => {
    const engine = useDataEngine()
    const [allowedLinks, setAllowedLinks] = useState([])

    const getProgramAccesses = async () => {
        try {
            const {programs} = await engine.query({
                programs: {
                    resource: "programs",
                    params: {
                        fields: [
                            "id",
                            "displayName",
                            "userGroupAccesses"
                        ],
                    }
                },
            });
            return programs?.programs
        } catch (e) {
            return e
        }
    }

    const exportAllowedLinks = async ({links, user}) => {
        try {
            const programs = await getProgramAccesses()

            const allowedPrograms = programs.filter(program => program.userGroupAccesses.some(access => access.access === "rwrw----" && user.userGroups.some(group => group.id === access.userGroupUid)))

            const allowedLinks = links.filter(link => !link.checkAccess ||
                (link.checkAccess && allowedPrograms.some(program => program.displayName.toLowerCase().includes(link.code.toLowerCase())))
            )

            setAllowedLinks(allowedLinks)

            return allowedLinks
        } catch (e) {
            return e
        }
    }

    return {getProgramAccesses, exportAllowedLinks, allowedLinks}
}