import { Router } from 'express'
import {isArtist} from "../security/UserManager";
import { CreateModelSchema, Model } from "../entity/Model";
import rateDTO, {rateSchema} from "../dto/rate";
import {verifUniqueRateModelService} from "../sevices/UniqueRateModelService";
import {User} from "../entity/User";


const router = Router()

router.get('/models', async (req, res) => {
    if (isArtist(req, res)) {
        return res.status(403).json({ error: 'Forbidden' })
    }

    const models = await Model.find({ valid: 0 })
    return res.status(200).json(models)
});

router.post('/rate/:id', async (req, res) => {
    if (isArtist(req, res)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { error } = rateSchema.validate(req.body)
    if (error != null) {
        return res.status(400).json({ error: error.message })
    }

    let rateDTO = req.body as rateDTO

    if (rateDTO.rate != -1 && rateDTO.rate != 1) {
        return res.status(400).json({ error: "rate out of range" })
    }

    if (rateDTO.comment == null || rateDTO.comment.length < 25) {
        return res.status(400).json({ error: "comment not complete enough" })
    }

    if(!await verifUniqueRateModelService(req.params.id, rateDTO.id_manager)){
        return res.status(400).json({ error: "you already given your rating" })
    }

    const model = await Model.findById(req.params.id)

    if (model == null) {
        return res.status(404).json({ error: "this model is not found" })
    }

    model.rating.push(
        {
            rate: rateDTO.rate,
            comment: rateDTO.comment,
            created_at: new Date(),
            id_manager: rateDTO.id_manager
        }
    )

    if(model.rating.length == await User.countDocuments({role: "manager"})){
        // todo
    }

    return res.status(200).json({ message: 'rating saved' })
})

export default router
