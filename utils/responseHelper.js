/**
 * Created by Дмитрий on 22.01.2018.
 */


//рендерит данные из dataSupplier в jade-темплейт данные или отправляет сообщение о 500-й ошибке
module.exports.getAndRenderData = async function(dataSupplier, templateName, res) {
    try {
        data = await dataSupplier();
        res.render(templateName, data);
    }
    catch (err)
    {
        console.log(err);
        res.status(500).send(err);
    }
};

//выполняет действие action и перенеправляет запрос
module.exports.doAndRedirect = async function(action, route, res)
{
    try {
        result = action();
        console.log(result.message);
        res.redirect(route);
    }
    catch (err)
    {
        console.log(err);
        res.status(500).send(err);
    }
};


//берет данные из асинхронного dataSupplier и фигачит JSON (для React)
module.exports.sendJSONData = async function(dataSupplier, templateName, res) {
    try {
        data = await dataSupplier();
        res.json(data);
    }
    catch (err)
    {
        console.log(err);
        res.status(500).send(err);
    }
};