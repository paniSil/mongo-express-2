import { ObjectId } from 'mongodb';

const getArticlesHandler = async (req, res) => {
    try {
        const db = req.app.locals.db
        if (!db) {
            return res.status(500).json({ message: 'Error: DB is not connected' });
        }

        const title = 'Article list (EJS)'
        const articlesCollection = db.collection('articles');
        const articles = await articlesCollection.find({}).toArray();

        const theme = req.cookies.theme || 'light';
        res.render('articles.ejs', { title: title, articles: articles, theme: theme, user: req.user });
    } catch (error) {
        console.error('Error: get articles list', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const postArticleHandler = async (req, res) => {
    try {
        const db = req.app.locals.db
        if (!db) {
            return res.status(500).json({ message: 'Error: DB is not connected' });
        }

        const { title, text } = req.body;
        const newArticle = {
            title,
            text,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const articlesCollection = db.collection('articles');
        const result = await articlesCollection.insertOne(newArticle);

        res.status(201).json({
            message: 'Article created!',
            articleId: result.insertedId,
            aricle: { _id: result.insertedId, title, text }
        });
    } catch (error) {
        console.error('Error: post article error', error);
        res.status(500).json({ message: 'Server error' });
    }

}

const getArticleByIdHandler = async (req, res) => {
    try {
        const db = req.app.locals.db
        if (!db) {
            return res.status(500).json({ message: 'Error: DB is not connected' });
        }

        const articleId = req.params.id;
        const articlesCollection = db.collection('articles');

        const article = await articlesCollection.findOne({ _id: new ObjectId(articleId) });
        const theme = req.cookies.theme || 'light';

        if (article) {
            res.render('article.ejs', { article: article, theme: theme, user: req.user });
        } else {
            res.status(404).send('Article Not Found');
        }
    } catch (error) {
        console.error('Error: get article by ID error', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const putArticleByIdHandler = async (req, res) => {
    try {
        const db = req.app.locals.db
        if (!db) {
            return res.status(500).json({ message: 'Error: DB is not connected' });
        }

        const articleId = req.params.id;
        const { title, text } = req.body;
        const updates = {};
        if (title) updates.title = title;
        if (text) updates.text = text;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No update data' });
        }

        updates.updatedAt = new Date();
        const articlesCollection = db.collection('articles');
        const result = await articlesCollection.updateOne(
            { _id: new ObjectId(articleId) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const updatedArticle = await articlesCollection.findOne({ _id: new ObjectId(articleId) });
        res.status(200).json({ message: `Article ${articleId} is updated`, article: updatedArticle });
    } catch (error) {
        console.error('Error: put article by ID error', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteArticleByIdHandler = async (req, res) => {
    try {
        const db = req.app.locals.db
        if (!db) {
            return res.status(500).json({ message: 'Error: DB is not connected' });
        }

        const articleId = req.params.id;
        if (!ObjectId.isValid(articleId)) {
            console.error('Invalid ObjectId format for article ID:', articleId);
            return res.status(400).json({ message: 'Wrong article ID format' });
        }

        const articlesCollection = db.collection('articles');

        const result = await articlesCollection.deleteOne({ _id: new ObjectId(articleId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error: delete article by ID error', error);
        res.status(500).json({ message: 'Server error' });
    }

}

export { getArticlesHandler, postArticleHandler, getArticleByIdHandler, putArticleByIdHandler, deleteArticleByIdHandler }