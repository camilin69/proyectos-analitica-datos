# documents_backend/models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import JSON
import json

db = SQLAlchemy()

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    article_title = db.Column(db.Text, nullable=False)
    abstract = db.Column(db.Text)
    authors = db.Column(JSON)  # Store as JSON array
    keywords = db.Column(JSON)  # Store as JSON array
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'))
    funding_id = db.Column(db.Integer, db.ForeignKey('funding.id'))
    language = db.Column(db.String(50))
    issn = db.Column(db.String(20))
    coden = db.Column(db.String(20))
    doi = db.Column(db.String(100))
    conference_code = db.Column(db.String(50))
    chemical_name = db.Column(db.String(200))
    cas_number = db.Column(db.String(50))
    orcid = db.Column(db.String(50))
    publication_date = db.Column(db.Date)
    cites_count = db.Column(db.Integer, default=0)
    document_type = db.Column(db.String(100))
    content = db.Column(JSON)  # Store sections as JSON
    subject_areas = db.Column(JSON)  # Store as JSON array
    source_title = db.Column(db.String(300))
    publisher = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # Relationships
    institution = db.relationship('Institution', backref='documents')
    funding = db.relationship('Funding', backref='documents')
    references = db.relationship('Reference', backref='document', lazy='dynamic')

class Institution(db.Model):
    __tablename__ = 'institutions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))

class Funding(db.Model):
    __tablename__ = 'funding'
    
    id = db.Column(db.Integer, primary_key=True)
    information = db.Column(db.Text)
    sponsor = db.Column(db.String(300))
    acronym = db.Column(db.String(50))
    number = db.Column(db.String(100))

class Reference(db.Model):
    __tablename__ = 'references'
    
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)
    reference_text = db.Column(db.Text, nullable=False)