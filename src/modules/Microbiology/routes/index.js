import {MicrobiologyListing} from "../views/MicrobiologyListing";
import {UploadDocument} from "../views/UploadDocument";


export const microbiologyRoutes = [
    {
        path: "/",
        component: MicrobiologyListing
    },
    {
        path: "/upload",
        component: UploadDocument
    },

]