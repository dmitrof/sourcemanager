/**
 * Created by Дмитрий on 19.03.2017.
 */


app.get(prefix.concat('/source_types'), source_controller.getSourceTypes);

app.post(prefix.concat('/add_source_type'), source_controller.createSourceType);

app.post(prefix.concat('/delete_source_type'), source_controller.deleteSourceType);