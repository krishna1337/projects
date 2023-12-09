from django import forms
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from markdown2 import markdown
from random import choice

from . import util

class NewPage(forms.Form):
    title = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}),label="Title")
    content = forms.CharField(widget=forms.Textarea(attrs={'class':'form-control','rows':'13'}),label="Markdown")

class EditPage(forms.Form):
    content = forms.CharField(widget=forms.Textarea(attrs={'class':'form-control','rows':'13'}),label="Markdown")

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, title):
    entry = util.get_entry(title)
    if entry is None:
        return render(request, "encyclopedia/error.html")

    return render(request, "encyclopedia/entry.html", {
        "title": title,
        "content": markdown(entry)
    })

def search(request):
    query = request.GET["q"].strip()
    match = []
    for entry in util.list_entries():
        if query.lower() == entry.lower():
            return HttpResponseRedirect(reverse('entry',args=[entry]))
        if query.lower() in entry.lower():
            match.append(entry)
    return render(request, "encyclopedia/search.html", {"entries":match})

def create(request):
    if request.method == "POST":
        form = NewPage(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            content=form.cleaned_data["content"]
            if title not in util.list_entries():
                util.save_entry(title, content)
            else:
                return render(request, "encyclopedia/create.html", {
                    "form": form,
                    "error": True
                })
            return HttpResponseRedirect(reverse('entry',args=[title]))
    return render(request, "encyclopedia/create.html", { # ---------------> It starts here.
        "form": NewPage()
    })

def edit(request, title):
    markdown = util.get_entry(title)
    if markdown is None:
        return render(request, "encyclopedia/error.html")

    if request.method == "POST":
        form = EditPage(request.POST)
        if form.is_valid():
            content=form.cleaned_data["content"]
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse('entry',args=[title]))

    return render(request, "encyclopedia/edit.html", { # ---------------> It starts here.
        "form": EditPage(initial={'content': markdown}),
        "title": title
    })

def random(request):
    random = choice(util.list_entries())
    return HttpResponseRedirect(reverse('entry',args=[random]))
