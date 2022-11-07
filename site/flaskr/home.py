from email.mime import image
import logging
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort

# from flaskr.auth import login_required
# from flaskr.db import get_db


bp = Blueprint('home', __name__)

@bp.route('/')
def index():
    # url = create_presigned_url('grandline-one', 'one_piece/1/0-b.png', 90)
    return render_template('index.html')
    # return render_template('rayleigh/html/index.html', image=url)


# @bp.route('/api/nextpage')
# def nextpage():
#     # current = "https://grandline-one.s3.amazonaws.com/one_piece/1/0-b.png"
#     current = request.args.get("current")
#     if not current:
#         abort()
#     elif current == "undefined":
#         abort()

#     chapter = current.split('/')[0]
#     page = current.split('/')[1]
#     page, side = page.split('-')

#     if side == 'a':
#         side = 'b' # move to next page since previous was side 'a'
#         # get the next page
#         # return create_presigned_url('grandline-one', f'one_piece/{chapter}/{page}-b.png', 10)
#     else:
#         # b pages check for either next page num, next chapter, or both
#         if int(page) < 30: # can tweak this; 8 should be the lowest number of spreads across all chapters
#             page = int(page)+1
#             side = 'a'
#             # return create_presigned_url('grandline-one', f'one_piece/{chapter}/{int(page)+1}-a.png', 10)
#         else:
#             # check if there are more pages before loading the next chapter
#             # check db for max pages, if less than 8+1 then next page
#             # if page == max page num and side == b then next chapter + 1 page 0-a
#             pass
    
#     if raw_url := create_presigned_url('grandline-one', f'one_piece/{chapter}/{page}-{side}.png', 90):
#         url = jsonify({"url": raw_url})
#     elif raw_url := create_presigned_url('grandline-one', f'one_piece/{int(chapter)+1}/0-a.png', 90):
#         url = jsonify({"url": raw_url})
#     else:
#         # set up logging
#         print(f"error getting next chapter, possibly {int(chapter)+1}")

#     return url


# def create_presigned_url(bucket_name, object_name, expiration=30):
#     """Generate a presigned URL to share an S3 object

#     :param bucket_name: string
#     :param object_name: string
#     :param expiration: Time in seconds for the presigned URL to remain valid
#     :return: Presigned URL as string. If error, returns None.
#     """

#     # Generate a presigned URL for the S3 object
#     s3_client = boto3.client('s3')
#     try:
#         s3_client.head_object(Bucket=bucket_name, Key=object_name)
#         response = s3_client.generate_presigned_url('get_object',
#                                                     Params={'Bucket': bucket_name,
#                                                             'Key': object_name},
#                                                     ExpiresIn=expiration)
#     except ClientError as e:
#         logging.error(e)
#         return None
#     # The response contains the presigned URL
#     return response

# @bp.route('/create', methods=('GET', 'POST'))
# @login_required
# def create():
#     if request.method == 'POST':
#         title = request.form['title']
#         body = request.form['body']
#         error = None

#         if not title:
#             error = 'Title is required.'

#         if error is not None:
#             flash(error)
#         else:
#             db = get_db()
#             db.execute(
#                 'INSERT INTO post (title, body, author_id)'
#                 ' VALUES (?, ?, ?)',
#                 (title, body, g.user['id'])
#             )
#             db.commit()
#             return redirect(url_for('reader.index'))

#     return render_template('reader/create.html')


# def get_post(id, check_author=True):
#     post = get_db().execute(
#         'SELECT p.id, title, body, created, author_id, username'
#         ' FROM post p JOIN user u ON p.author_id = u.id'
#         ' WHERE p.id = ?',
#         (id,)
#     ).fetchone()

#     if post is None:
#         abort(404, f"Post id {id} doesn't exist.")

#     if check_author and post['author_id'] != g.user['id']:
#         abort(403)

#     return post


# @bp.route('/<int:id>/update', methods=('GET', 'POST'))
# @login_required
# def update(id):
#     post = get_post(id)

#     if request.method == 'POST':
#         title = request.form['title']
#         body = request.form['body']
#         error = None

#         if not title:
#             error = 'Title is required.'

#         if error is not None:
#             flash(error)
#         else:
#             db = get_db()
#             db.execute(
#                 'UPDATE post SET title = ?, body = ?'
#                 ' WHERE id = ?',
#                 (title, body, id)
#             )
#             db.commit()
#             return redirect(url_for('reader.index'))

#     return render_template('reader/update.html', post=post)


# @bp.route('/<int:id>/delete', methods=('POST',))
# @login_required
# def delete(id):
#     get_post(id)
#     db = get_db()
#     db.execute('DELETE FROM post WHERE id = ?', (id,))
#     db.commit()
#     return redirect(url_for('reader.index'))